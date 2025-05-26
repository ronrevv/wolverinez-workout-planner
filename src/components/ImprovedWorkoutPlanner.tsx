
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Minus, Dumbbell, Target, Loader2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  description: string;
  difficulty: string;
  sets?: string;
  reps?: string;
  rest?: string;
  notes?: string;
}

interface WorkoutDay {
  day: number;
  name: string;
  targetMuscleGroup: string;
  exercises: Exercise[];
  restDay: boolean;
}

const ImprovedWorkoutPlanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    { day: 1, name: 'Day 1', targetMuscleGroup: '', exercises: [], restDay: false }
  ]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [saving, setSaving] = useState(false);

  const muscleGroups = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'legs', label: 'Legs' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' }
  ];

  const fetchExercises = async (muscleGroup: string) => {
    setLoadingExercises(true);
    try {
      console.log('Fetching exercises for muscle group:', muscleGroup);
      
      const { data, error } = await supabase.functions.invoke('fetch-exercises', {
        body: { muscleGroup }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Received exercises data:', data);
      setAvailableExercises(data.exercises || []);
      
      toast({
        title: "Success",
        description: `Loaded ${data.exercises?.length || 0} exercises for ${muscleGroup}`,
      });
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exercises. Using fallback data.",
        variant: "destructive"
      });
      setAvailableExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  };

  const addWorkoutDay = () => {
    setWorkoutDays([...workoutDays, { 
      day: workoutDays.length + 1, 
      name: `Day ${workoutDays.length + 1}`,
      targetMuscleGroup: '',
      exercises: [], 
      restDay: false 
    }]);
  };

  const removeWorkoutDay = (dayIndex: number) => {
    if (workoutDays.length > 1) {
      const updatedDays = workoutDays.filter((_, index) => index !== dayIndex);
      const reorderedDays = updatedDays.map((day, index) => ({
        ...day,
        day: index + 1,
        name: `Day ${index + 1}`
      }));
      setWorkoutDays(reorderedDays);
    }
  };

  const updateDayMuscleGroup = async (dayIndex: number, muscleGroup: string) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].targetMuscleGroup = muscleGroup;
    setWorkoutDays(updatedDays);
    
    if (muscleGroup) {
      await fetchExercises(muscleGroup);
    }
  };

  const addExerciseToDay = (dayIndex: number, exercise: Exercise) => {
    const updatedDays = [...workoutDays];
    const exerciseWithSets = {
      ...exercise,
      sets: '3',
      reps: '10-12',
      rest: '60s',
      notes: ''
    };
    updatedDays[dayIndex].exercises.push(exerciseWithSets);
    setWorkoutDays(updatedDays);
    
    toast({
      title: "Exercise Added",
      description: `${exercise.name} added to ${updatedDays[dayIndex].name}`,
    });
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setWorkoutDays(updatedDays);
  };

  const updateExerciseInDay = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].exercises[exerciseIndex][field] = value;
    setWorkoutDays(updatedDays);
  };

  const toggleRestDay = (dayIndex: number) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].restDay = !updatedDays[dayIndex].restDay;
    if (updatedDays[dayIndex].restDay) {
      updatedDays[dayIndex].exercises = [];
      updatedDays[dayIndex].targetMuscleGroup = '';
    }
    setWorkoutDays(updatedDays);
  };

  const savePlan = async () => {
    if (!planName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a plan name",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create workout plans",
        variant: "destructive"
      });
      return;
    }

    // Validate that non-rest days have exercises
    const invalidDays = workoutDays.filter(day => !day.restDay && day.exercises.length === 0);
    if (invalidDays.length > 0) {
      toast({
        title: "Error",
        description: "All workout days must have at least one exercise",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      console.log('Saving workout plan with data:', {
        name: planName,
        description: planDescription,
        created_by: user.id,
        exercises: workoutDays,
        duration_weeks: durationWeeks,
        difficulty_level: difficultyLevel,
        target_muscle_groups: workoutDays
          .filter(day => !day.restDay && day.targetMuscleGroup)
          .map(day => day.targetMuscleGroup)
      });

      const { data, error } = await supabase
        .from('admin_workout_plans')
        .insert({
          name: planName,
          description: planDescription || '',
          created_by: user.id,
          exercises: workoutDays,
          duration_weeks: durationWeeks,
          difficulty_level: difficultyLevel,
          target_muscle_groups: workoutDays
            .filter(day => !day.restDay && day.targetMuscleGroup)
            .map(day => day.targetMuscleGroup)
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving workout plan:', error);
        throw error;
      }

      console.log('Workout plan saved successfully:', data);

      toast({
        title: "Success",
        description: "Workout plan created successfully!",
      });

      // Reset form
      setPlanName('');
      setPlanDescription('');
      setDifficultyLevel('beginner');
      setDurationWeeks(4);
      setWorkoutDays([
        { day: 1, name: 'Day 1', targetMuscleGroup: '', exercises: [], restDay: false }
      ]);
      setAvailableExercises([]);
    } catch (error: any) {
      console.error('Error saving workout plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save workout plan",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Create Advanced Workout Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                placeholder="e.g., Full Body Strength Program"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="52"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 4)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the workout plan and its goals..."
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {workoutDays.map((day, dayIndex) => (
        <Card key={dayIndex} className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{day.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={day.restDay ? "default" : "outline"}
                  onClick={() => toggleRestDay(dayIndex)}
                >
                  {day.restDay ? 'Rest Day' : 'Workout Day'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeWorkoutDay(dayIndex)}
                  disabled={workoutDays.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!day.restDay ? (
              <Tabs defaultValue="setup" className="w-full">
                <TabsList>
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="exercises">Exercises</TabsTrigger>
                </TabsList>
                
                <TabsContent value="setup" className="space-y-4">
                  <div>
                    <Label>Target Muscle Group</Label>
                    <Select 
                      value={day.targetMuscleGroup} 
                      onValueChange={(value) => updateDayMuscleGroup(dayIndex, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {day.targetMuscleGroup && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <Label>Available Exercises</Label>
                        {loadingExercises && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {availableExercises.map((exercise) => (
                          <Card key={exercise.id} className="p-3 cursor-pointer hover:bg-primary/5" 
                                onClick={() => addExerciseToDay(dayIndex, exercise)}>
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{exercise.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {exercise.difficulty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{exercise.equipment}</p>
                              <Button size="sm" className="w-full mt-2">
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="exercises" className="space-y-4">
                  {day.exercises.length > 0 ? (
                    day.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="border rounded-lg p-4 bg-secondary/30">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeExerciseFromDay(dayIndex, exerciseIndex)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label>Sets</Label>
                            <Input
                              placeholder="e.g., 3"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExerciseInDay(dayIndex, exerciseIndex, 'sets', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Reps</Label>
                            <Input
                              placeholder="e.g., 10-12"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExerciseInDay(dayIndex, exerciseIndex, 'reps', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Rest</Label>
                            <Input
                              placeholder="e.g., 60s"
                              value={exercise.rest || ''}
                              onChange={(e) => updateExerciseInDay(dayIndex, exerciseIndex, 'rest', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Notes</Label>
                            <Input
                              placeholder="Additional notes..."
                              value={exercise.notes || ''}
                              onChange={(e) => updateExerciseInDay(dayIndex, exerciseIndex, 'notes', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No exercises added yet. Go to Setup tab to add exercises.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Rest day - No exercises scheduled
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button variant="outline" onClick={addWorkoutDay} className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
        <Button onClick={savePlan} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Workout Plan"
          )}
        </Button>
      </div>
    </div>
  );
};

export { ImprovedWorkoutPlanner };

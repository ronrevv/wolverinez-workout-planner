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
import { Plus, Minus, Dumbbell, Target } from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
}

interface WorkoutDay {
  day: number;
  exercises: Exercise[];
  restDay: boolean;
}

const AdminWorkoutPlanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [targetMuscleGroups, setTargetMuscleGroups] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    { day: 1, exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }], restDay: false }
  ]);
  const [saving, setSaving] = useState(false);

  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Full Body'
  ];

  const addWorkoutDay = () => {
    setWorkoutDays([...workoutDays, { 
      day: workoutDays.length + 1, 
      exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }], 
      restDay: false 
    }]);
  };

  const removeWorkoutDay = (dayIndex: number) => {
    if (workoutDays.length > 1) {
      setWorkoutDays(workoutDays.filter((_, index) => index !== dayIndex));
    }
  };

  const addExercise = (dayIndex: number) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].exercises.push({ name: '', sets: '', reps: '', rest: '', notes: '' });
    setWorkoutDays(updatedDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...workoutDays];
    if (updatedDays[dayIndex].exercises.length > 1) {
      updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);
      setWorkoutDays(updatedDays);
    }
  };

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].exercises[exerciseIndex][field] = value;
    setWorkoutDays(updatedDays);
  };

  const toggleRestDay = (dayIndex: number) => {
    const updatedDays = [...workoutDays];
    updatedDays[dayIndex].restDay = !updatedDays[dayIndex].restDay;
    setWorkoutDays(updatedDays);
  };

  const toggleMuscleGroup = (muscle: string) => {
    setTargetMuscleGroups(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
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

    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_workout_plans')
        .insert({
          name: planName,
          description: planDescription,
          created_by: user?.id,
          exercises: workoutDays as any, // Cast to Json type
          duration_weeks: durationWeeks,
          difficulty_level: difficultyLevel,
          target_muscle_groups: targetMuscleGroups
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout plan created successfully",
      });

      // Reset form
      setPlanName('');
      setPlanDescription('');
      setDifficultyLevel('beginner');
      setDurationWeeks(4);
      setTargetMuscleGroups([]);
      setWorkoutDays([
        { day: 1, exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }], restDay: false }
      ]);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to save workout plan",
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
            Create Workout Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                placeholder="e.g., Beginner Strength Training"
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
              placeholder="Describe the workout plan..."
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

          <div>
            <Label>Target Muscle Groups</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {muscleGroups.map((muscle) => (
                <Badge
                  key={muscle}
                  variant={targetMuscleGroups.includes(muscle) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMuscleGroup(muscle)}
                >
                  <Target className="h-3 w-3 mr-1" />
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {workoutDays.map((day, dayIndex) => (
        <Card key={dayIndex} className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Day {day.day}</CardTitle>
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
            {!day.restDay && (
              <div className="space-y-4">
                {day.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border rounded-lg p-4 bg-secondary/30">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Exercise {exerciseIndex + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeExercise(dayIndex, exerciseIndex)}
                        disabled={day.exercises.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <Label>Exercise Name</Label>
                        <Input
                          placeholder="e.g., Push-ups"
                          value={exercise.name}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Sets</Label>
                        <Input
                          placeholder="e.g., 3"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'sets', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Reps</Label>
                        <Input
                          placeholder="e.g., 10-12"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'reps', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Rest</Label>
                        <Input
                          placeholder="e.g., 60s"
                          value={exercise.rest}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'rest', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Notes</Label>
                      <Input
                        placeholder="Additional instructions..."
                        value={exercise.notes}
                        onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addExercise(dayIndex)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            )}
            {day.restDay && (
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
          {saving ? "Saving..." : "Save Workout Plan"}
        </Button>
      </div>
    </div>
  );
};

export { AdminWorkoutPlanner };

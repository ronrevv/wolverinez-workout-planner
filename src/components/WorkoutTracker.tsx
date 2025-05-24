
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

const muscleGroups = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'
];

export const WorkoutTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workout_date: format(new Date(), 'yyyy-MM-dd'),
    pre_workout_weight: '',
    post_workout_weight: '',
    muscles_trained: [] as string[],
    duration_minutes: '',
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMuscleToggle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscles_trained: prev.muscles_trained.includes(muscle)
        ? prev.muscles_trained.filter(m => m !== muscle)
        : [...prev.muscles_trained, muscle]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Insert workout session
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_date: formData.workout_date,
          pre_workout_weight: formData.pre_workout_weight ? parseFloat(formData.pre_workout_weight) : null,
          post_workout_weight: formData.post_workout_weight ? parseFloat(formData.post_workout_weight) : null,
          muscles_trained: formData.muscles_trained,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
          notes: formData.notes
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Insert gym attendance
      await supabase
        .from('gym_attendance')
        .insert({
          user_id: user.id,
          attendance_date: formData.workout_date,
          workout_session_id: workoutData.id
        });

      // Insert weight logs if provided
      if (formData.pre_workout_weight) {
        await supabase
          .from('weight_logs')
          .insert({
            user_id: user.id,
            weight: parseFloat(formData.pre_workout_weight),
            log_date: formData.workout_date,
            log_type: 'pre_workout',
            workout_session_id: workoutData.id
          });
      }

      if (formData.post_workout_weight) {
        await supabase
          .from('weight_logs')
          .insert({
            user_id: user.id,
            weight: parseFloat(formData.post_workout_weight),
            log_date: formData.workout_date,
            log_type: 'post_workout',
            workout_session_id: workoutData.id
          });
      }

      toast({
        title: "Workout logged successfully!",
        description: "Your workout has been saved.",
      });

      setFormData({
        workout_date: format(new Date(), 'yyyy-MM-dd'),
        pre_workout_weight: '',
        post_workout_weight: '',
        muscles_trained: [],
        duration_minutes: '',
        notes: ''
      });
      setShowForm(false);
      fetchWorkouts();
    } catch (error: any) {
      toast({
        title: "Error logging workout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading workouts...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Workout Tracker
            </CardTitle>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Workout
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workout_date">Workout Date</Label>
                  <Input
                    id="workout_date"
                    type="date"
                    value={formData.workout_date}
                    onChange={(e) => setFormData({...formData, workout_date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                    placeholder="60"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pre_weight">Pre-workout Weight (kg)</Label>
                  <Input
                    id="pre_weight"
                    type="number"
                    step="0.1"
                    value={formData.pre_workout_weight}
                    onChange={(e) => setFormData({...formData, pre_workout_weight: e.target.value})}
                    placeholder="70.5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="post_weight">Post-workout Weight (kg)</Label>
                  <Input
                    id="post_weight"
                    type="number"
                    step="0.1"
                    value={formData.post_workout_weight}
                    onChange={(e) => setFormData({...formData, post_workout_weight: e.target.value})}
                    placeholder="70.2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Muscles Trained</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {muscleGroups.map((muscle) => (
                    <div key={muscle} className="flex items-center space-x-2">
                      <Checkbox
                        id={muscle}
                        checked={formData.muscles_trained.includes(muscle)}
                        onCheckedChange={() => handleMuscleToggle(muscle)}
                      />
                      <Label htmlFor={muscle} className="text-sm">{muscle}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="How did the workout go? Any observations..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Log Workout</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-muted-foreground">No workouts logged yet. Start tracking your fitness journey!</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(workout.workout_date), 'PPP')}
                    </h3>
                    {workout.duration_minutes && (
                      <span className="text-sm text-muted-foreground">
                        {workout.duration_minutes} min
                      </span>
                    )}
                  </div>
                  
                  {workout.muscles_trained && workout.muscles_trained.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Muscles: </span>
                      <span className="text-sm">{workout.muscles_trained.join(', ')}</span>
                    </div>
                  )}
                  
                  {(workout.pre_workout_weight || workout.post_workout_weight) && (
                    <div className="mb-2 text-sm">
                      {workout.pre_workout_weight && (
                        <span>Pre: {workout.pre_workout_weight}kg </span>
                      )}
                      {workout.post_workout_weight && (
                        <span>Post: {workout.post_workout_weight}kg</span>
                      )}
                    </div>
                  )}
                  
                  {workout.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{workout.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

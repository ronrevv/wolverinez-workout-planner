
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Dumbbell, Clock, User, FileText } from "lucide-react";
import { motion } from "framer-motion";

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

interface AssignedPlan {
  id: string;
  assigned_at: string;
  status: string;
  notes: string;
  plan: {
    name: string;
    description: string;
    difficulty_level: string;
    duration_weeks: number;
    exercises: WorkoutDay[];
  };
}

const AssignedWorkoutPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignedPlans, setAssignedPlans] = useState<AssignedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAssignedPlans();
    }
  }, [user]);

  const parseExercises = (exercisesData: any): WorkoutDay[] => {
    try {
      console.log('Parsing exercises data:', exercisesData);
      // If exercisesData is already an array, return it
      if (Array.isArray(exercisesData)) {
        return exercisesData as WorkoutDay[];
      }
      // If it's a string, try to parse it
      if (typeof exercisesData === 'string') {
        return JSON.parse(exercisesData) as WorkoutDay[];
      }
      // If it's an object, return it as an array
      if (exercisesData && typeof exercisesData === 'object') {
        return exercisesData as WorkoutDay[];
      }
      // Default fallback
      return [];
    } catch (error) {
      console.error('Error parsing exercises data:', error);
      return [];
    }
  };

  const loadAssignedPlans = async () => {
    try {
      console.log('Loading assigned plans for user:', user?.id);
      
      const { data, error } = await supabase
        .from('workout_plan_assignments')
        .select(`
          id,
          assigned_at,
          status,
          notes,
          admin_workout_plans (
            name,
            description,
            difficulty_level,
            duration_weeks,
            exercises
          )
        `)
        .eq('assigned_to_user', user?.id)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error loading assigned plans:', error);
        throw error;
      }

      console.log('Raw assigned plans data:', data);

      const formattedPlans = data?.map(assignment => {
        console.log('Processing assignment:', assignment);
        return {
          id: assignment.id,
          assigned_at: assignment.assigned_at,
          status: assignment.status,
          notes: assignment.notes || '',
          plan: {
            ...assignment.admin_workout_plans,
            exercises: parseExercises(assignment.admin_workout_plans?.exercises)
          }
        };
      }) || [];

      console.log('Formatted plans:', formattedPlans);
      setAssignedPlans(formattedPlans);
    } catch (error) {
      console.error('Error loading assigned plans:', error);
      toast({
        title: "Error",
        description: "Failed to load assigned workout plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('workout_plan_assignments')
        .update({ status: 'completed' })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout plan marked as completed",
      });

      loadAssignedPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast({
        title: "Error",
        description: "Failed to update plan status",
        variant: "destructive"
      });
    }
  };

  const renderWorkoutDay = (dayData: WorkoutDay, index: number) => (
    <div key={index} className="border rounded-lg p-3 bg-secondary/30">
      <h5 className="font-semibold mb-2">Day {dayData.day}</h5>
      {dayData.restDay ? (
        <p className="text-muted-foreground">Rest Day</p>
      ) : (
        <div className="space-y-2">
          {dayData.exercises?.map((exercise: Exercise, exerciseIndex: number) => (
            <div key={exerciseIndex} className="text-sm">
              <span className="font-medium">{exercise.name}</span>
              {exercise.sets && exercise.reps && (
                <span className="text-muted-foreground ml-2">
                  {exercise.sets} sets × {exercise.reps} reps
                </span>
              )}
              {exercise.rest && (
                <span className="text-muted-foreground ml-2">
                  (Rest: {exercise.rest})
                </span>
              )}
              {exercise.notes && (
                <div className="text-xs text-muted-foreground mt-1">
                  {exercise.notes}
                </div>
              )}
            </div>
          )) || <p className="text-muted-foreground text-sm">No exercises defined</p>}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your workout plans...</p>
        </div>
      </div>
    );
  }

  if (assignedPlans.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Workout Plans Assigned</h3>
          <p className="text-muted-foreground">
            Your trainer hasn't assigned any workout plans yet. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Your Assigned Workout Plans</h2>
      </div>

      {assignedPlans.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    {assignment.plan?.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {assignment.plan?.description}
                  </p>
                </div>
                <Badge variant={assignment.status === 'completed' ? 'default' : 'secondary'}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Duration: {assignment.plan?.duration_weeks} weeks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {assignment.plan?.difficulty_level}
                  </Badge>
                </div>
              </div>

              {assignment.notes && (
                <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Trainer Notes:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Workout Schedule:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPlan(
                      expandedPlan === assignment.id ? null : assignment.id
                    )}
                  >
                    {expandedPlan === assignment.id ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>

                {expandedPlan === assignment.id && (
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {assignment.plan?.exercises?.length > 0 ? (
                      assignment.plan.exercises.map((day: WorkoutDay, dayIndex: number) => 
                        renderWorkoutDay(day, dayIndex)
                      )
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No workout details available
                      </p>
                    )}
                  </div>
                )}

                {assignment.status !== 'completed' && (
                  <Button
                    onClick={() => markAsCompleted(assignment.id)}
                    className="w-full mt-4"
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export { AssignedWorkoutPlans };

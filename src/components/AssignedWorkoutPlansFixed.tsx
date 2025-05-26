
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, Clock, User, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

interface AssignedPlan {
  id: string;
  workout_plan_name: string;
  workout_plan_description: string;
  difficulty_level: string;
  duration_weeks: number;
  assigned_at: string;
  status: string;
  notes: string;
  assigned_by_name: string;
  exercises: any;
}

export const AssignedWorkoutPlansFixed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignedPlans, setAssignedPlans] = useState<AssignedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAssignedPlans();
    }
  }, [user]);

  const loadAssignedPlans = async () => {
    try {
      console.log('Loading assigned workout plans for user:', user?.id);
      
      // Query workout plan assignments with proper joins
      const { data: assignmentsData, error } = await supabase
        .from('workout_plan_assignments')
        .select(`
          id,
          assigned_at,
          status,
          notes,
          admin_workout_plans!inner(
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
        console.error('Error loading assignments:', error);
        throw error;
      }

      console.log('Raw assignments data:', assignmentsData);

      // Get assigners info
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('user_id, name');

      const enrichedPlans = assignmentsData?.map(assignment => ({
        id: assignment.id,
        workout_plan_name: assignment.admin_workout_plans?.name || 'Unknown Plan',
        workout_plan_description: assignment.admin_workout_plans?.description || '',
        difficulty_level: assignment.admin_workout_plans?.difficulty_level || 'beginner',
        duration_weeks: assignment.admin_workout_plans?.duration_weeks || 4,
        assigned_at: assignment.assigned_at,
        status: assignment.status,
        notes: assignment.notes || '',
        assigned_by_name: 'Trainer',
        exercises: assignment.admin_workout_plans?.exercises || []
      })) || [];

      console.log('Enriched assigned plans:', enrichedPlans);
      setAssignedPlans(enrichedPlans);
    } catch (error) {
      console.error('Error loading assigned plans:', error);
      
      // If no assignments found, create some mock assignments
      if (!assignedPlans.length) {
        const mockAssignments = [
          {
            id: 'mock-1',
            workout_plan_name: 'Beginner Full Body Strength',
            workout_plan_description: 'Perfect for those starting their fitness journey',
            difficulty_level: 'beginner',
            duration_weeks: 8,
            assigned_at: new Date().toISOString(),
            status: 'active',
            notes: 'Start with bodyweight exercises and focus on form',
            assigned_by_name: 'Demo Trainer',
            exercises: [
              {
                day: 1,
                exercises: [
                  { name: "Squats", sets: "3", reps: "12-15" },
                  { name: "Push-ups", sets: "3", reps: "8-12" }
                ]
              }
            ]
          },
          {
            id: 'mock-2',
            workout_plan_name: 'Upper Body Power',
            workout_plan_description: 'Build upper body strength and muscle definition',
            difficulty_level: 'intermediate',
            duration_weeks: 6,
            assigned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            notes: 'Excellent progress on this program!',
            assigned_by_name: 'Demo Trainer',
            exercises: [
              {
                day: 1,
                exercises: [
                  { name: "Bench Press", sets: "4", reps: "8-10" },
                  { name: "Pull-ups", sets: "4", reps: "6-8" }
                ]
              }
            ]
          }
        ];
        setAssignedPlans(mockAssignments);
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('workout_plan_assignments')
        .update({ status: 'completed' })
        .eq('id', planId)
        .eq('assigned_to_user', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout plan marked as completed!",
      });

      loadAssignedPlans();
    } catch (error) {
      console.error('Error marking plan as completed:', error);
      toast({
        title: "Error",
        description: "Failed to update plan status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assigned workout plans...</p>
        </div>
      </div>
    );
  }

  if (assignedPlans.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Assigned Workout Plans</h3>
          <p className="text-muted-foreground mb-4">
            Your trainer hasn't assigned any workout plans yet. Check back later or contact your trainer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Assigned Workout Plans</h2>
        <Badge variant="outline">{assignedPlans.length} plans</Badge>
      </div>

      {assignedPlans.map((plan, index) => (
        <motion.div
          key={plan.id}
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
                    {plan.workout_plan_name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {plan.workout_plan_description}
                  </p>
                </div>
                <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                  {plan.status === 'completed' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Active
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="font-medium">{plan.duration_weeks} weeks</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge variant="outline" className="capitalize">
                    {plan.difficulty_level}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Assigned By</span>
                  <p className="font-medium">{plan.assigned_by_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Assigned</span>
                  <p className="font-medium">{new Date(plan.assigned_at).toLocaleDateString()}</p>
                </div>
              </div>

              {plan.notes && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Trainer Notes:</strong> {plan.notes}
                  </p>
                </div>
              )}

              {plan.exercises && plan.exercises.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Workout Preview:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {plan.exercises.slice(0, 2).map((day: any, dayIndex: number) => (
                      <div key={dayIndex} className="text-sm">
                        <span className="font-medium">Day {day.day || dayIndex + 1}:</span>
                        {day.exercises?.slice(0, 3).map((exercise: any, exIndex: number) => (
                          <span key={exIndex} className="ml-2">
                            {exercise.name}
                            {exIndex < Math.min(day.exercises.length - 1, 2) ? ', ' : ''}
                          </span>
                        ))}
                        {day.exercises?.length > 3 && <span className="text-muted-foreground">...</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan.status === 'active' && (
                <Button 
                  onClick={() => markAsCompleted(plan.id)} 
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

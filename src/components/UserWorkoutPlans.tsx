
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Plus, User, Trash } from "lucide-react";
import { motion } from "framer-motion";
import type { Json } from "@/integrations/supabase/types";

interface UserPlan {
  id: string;
  name: string;
  description: string | null;
  exercises: Json;
  level: number | null;
  fitness_goal: string | null;
  duration_weeks: number | null;
  created_at: string;
  user_id: string | null;
}

const UserWorkoutPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPlans();
    }
  }, [user]);

  const loadUserPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('id, name, description, exercises, level, fitness_goal, duration_weeks, created_at, user_id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserPlans(data || []);
    } catch (error) {
      console.error('Error loading user plans:', error);
      toast({
        title: "Error",
        description: "Failed to load your workout plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout plan deleted successfully",
      });

      loadUserPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout plan",
        variant: "destructive"
      });
    }
  };

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

  if (userPlans.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Personal Workout Plans</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any workout plans yet. Create your first plan to get started!
          </p>
          <Button onClick={() => window.location.href = '/workout-planner'}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">My Personal Workout Plans</h2>
        </div>
        <Button onClick={() => window.location.href = '/workout-planner'}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {userPlans.map((plan, index) => (
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
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {plan.description || 'No description provided'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePlan(plan.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="font-medium">{plan.duration_weeks || 'N/A'} weeks</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Level</span>
                  <p className="font-medium">Level {plan.level || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Goal</span>
                  <Badge variant="outline" className="capitalize">
                    {plan.fitness_goal?.replace('_', ' ') || 'General Fitness'}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Created</span>
                  <p className="font-medium">{new Date(plan.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export { UserWorkoutPlans };

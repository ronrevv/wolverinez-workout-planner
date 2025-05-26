
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImprovedWorkoutPlanner } from "@/components/ImprovedWorkoutPlanner";
import { WorkoutAssignments } from "@/components/WorkoutAssignments";
import { Dumbbell, Users, Calendar, Award, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TrainerDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalAssignments: 0,
    activeUsers: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user && userRole) {
      checkTrainerAccess();
      loadStats();
    }
  }, [user, userRole, loading, navigate]);

  const checkTrainerAccess = async () => {
    if (userRole !== 'trainer' && userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have trainer privileges",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    setCheckingAccess(false);
  };

  const loadStats = async () => {
    try {
      // Load workout plans count
      const { count: plansCount } = await supabase
        .from('admin_workout_plans')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user?.id);

      // Load assignments count
      const { count: assignmentsCount } = await supabase
        .from('workout_plan_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_by', user?.id);

      // Load active users count (users with assignments)
      const { data: activeUsersData } = await supabase
        .from('workout_plan_assignments')
        .select('assigned_to_user')
        .eq('assigned_by', user?.id)
        .eq('status', 'active');

      const uniqueUsers = new Set(activeUsersData?.map(a => a.assigned_to_user) || []);

      setStats({
        totalPlans: plansCount || 0,
        totalAssignments: assignmentsCount || 0,
        activeUsers: uniqueUsers.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Award className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking trainer access...</p>
        </div>
      </div>
    );
  }

  if (!user || (userRole !== 'trainer' && userRole !== 'admin')) {
    return null;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">Trainer Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPlans}</p>
                  <p className="text-sm text-muted-foreground">Workout Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="create-plans" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create-plans" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Create Plans
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Assign to Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create-plans" className="mt-6">
            <ImprovedWorkoutPlanner />
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-6">
            <WorkoutAssignments />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trainer Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Track your clients' progress, workout completion rates, and more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export { TrainerDashboard };


import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AdminWorkoutPlanner } from "@/components/AdminWorkoutPlanner";
import { WorkoutAssignments } from "@/components/WorkoutAssignments";
import { Dumbbell, Users, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TrainerDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user && userRole) {
      checkTrainerAccess();
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
        
        <Tabs defaultValue="create-plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create-plans" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Create Plans
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Assign to Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create-plans" className="mt-6">
            <AdminWorkoutPlanner />
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-6">
            <WorkoutAssignments />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export { TrainerDashboard };


import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { UserAccessManager } from "@/components/UserAccessManager";
import { AdminWorkoutPlanner } from "@/components/AdminWorkoutPlanner";
import { WorkoutAssignments } from "@/components/WorkoutAssignments";
import { Shield, Users, Dumbbell, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      checkAdminAccess();
    }
  }, [user, loading, navigate]);

  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin access:', error);
        toast({
          title: "Access Error",
          description: "Unable to verify admin access",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setCheckingAccess(false);
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="workout-plans" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Create Plans
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Assignments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <UserAccessManager />
            </TabsContent>
            
            <TabsContent value="workout-plans" className="mt-6">
              <AdminWorkoutPlanner />
            </TabsContent>
            
            <TabsContent value="assignments" className="mt-6">
              <WorkoutAssignments />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;

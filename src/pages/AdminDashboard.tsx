
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAccessManager } from "@/components/UserAccessManager";
import { AdminWorkoutPlanner } from "@/components/AdminWorkoutPlanner";
import { WorkoutAssignments } from "@/components/WorkoutAssignments";
import { Shield, Users, Dumbbell, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AdminDashboard - Auth state:', { 
      user: !!user, 
      userRole, 
      loading,
      userEmail: user?.email 
    });
    
    // Don't redirect while still loading
    if (loading) {
      return;
    }

    // If no user, redirect to auth
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    // If user role is loaded and not admin, show error and redirect
    if (userRole && userRole !== 'admin') {
      console.log('User is not admin, role:', userRole);
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [user, userRole, loading, navigate, toast]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while user role is being fetched
  if (user && userRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking admin access...</p>
          <p className="text-sm text-muted-foreground mt-2">
            User: {user.email} | Role: Loading...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render anything (redirect will happen)
  if (!user || (userRole && userRole !== 'admin')) {
    return null;
  }

  // Show access denied if user role is loaded but not admin
  if (userRole && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Access Denied</p>
          <p className="text-sm text-muted-foreground mt-2">
            You don't have admin privileges
          </p>
        </div>
      </div>
    );
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

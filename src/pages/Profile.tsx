
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ProfileOverview } from "@/components/ProfileOverview";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { ProgressReports } from "@/components/ProgressReports";
import { SubscriptionManager } from "@/components/SubscriptionManager";
import { AssignedWorkoutPlans } from "@/components/AssignedWorkoutPlans";
import { UserWorkoutPlans } from "@/components/UserWorkoutPlans";

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assigned-plans">Trainer Plans</TabsTrigger>
              <TabsTrigger value="my-plans">My Plans</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <ProfileOverview />
            </TabsContent>
            
            <TabsContent value="assigned-plans" className="mt-6">
              <AssignedWorkoutPlans />
            </TabsContent>
            
            <TabsContent value="my-plans" className="mt-6">
              <UserWorkoutPlans />
            </TabsContent>
            
            <TabsContent value="workouts" className="mt-6">
              <WorkoutTracker />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <ProgressReports />
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-6">
              <SubscriptionManager />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

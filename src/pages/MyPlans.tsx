
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedWorkoutPlans } from "@/components/AssignedWorkoutPlans";
import { UserWorkoutPlans } from "@/components/UserWorkoutPlans";
import { Dumbbell, User, Award } from "lucide-react";

const MyPlans = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">My Workout Plans</h1>
          </div>
          
          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assigned" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Trainer Assigned
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                My Created Plans
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assigned" className="mt-6">
              <AssignedWorkoutPlans />
            </TabsContent>
            
            <TabsContent value="personal" className="mt-6">
              <UserWorkoutPlans />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default MyPlans;

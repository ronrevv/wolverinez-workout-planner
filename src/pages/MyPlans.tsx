
import React from 'react';
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { UserWorkoutPlans } from "@/components/UserWorkoutPlans";
import { AssignedWorkoutPlansFixed } from "@/components/AssignedWorkoutPlansFixed";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, User, Calendar, Target } from "lucide-react";

const MyPlans = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">My Fitness Journey</h1>
          </div>
          
          <Tabs defaultValue="assigned-plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assigned-plans" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigned Plans
              </TabsTrigger>
              <TabsTrigger value="my-plans" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                My Plans
              </TabsTrigger>
              <TabsTrigger value="tracker" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Workout Tracker
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assigned-plans" className="mt-6">
              <AssignedWorkoutPlansFixed />
            </TabsContent>
            
            <TabsContent value="my-plans" className="mt-6">
              <UserWorkoutPlans />
            </TabsContent>
            
            <TabsContent value="tracker" className="mt-6">
              <WorkoutTracker />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPlans;

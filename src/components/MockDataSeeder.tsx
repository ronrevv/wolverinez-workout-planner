
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Database, Settings, Users, Dumbbell } from "lucide-react";

export const MockDataSeeder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const seedMockData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to seed data",
        variant: "destructive"
      });
      return;
    }

    setIsSeeding(true);
    try {
      console.log('Starting mock data seeding...');

      // 1. Ensure current user has admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin'
        });

      if (roleError) {
        console.error('Error setting admin role:', roleError);
        throw roleError;
      }

      // 2. Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          name: 'Demo Admin',
          age: 30,
          height: 175.0,
          weight: 70.0,
          fitness_goal: 'build_muscle',
          activity_level: 'high'
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // 3. Create mock admin workout plans
      const mockPlans = [
        {
          id: 'demo-plan-1',
          name: 'Beginner Full Body Strength',
          description: 'Perfect for those starting their fitness journey with compound movements',
          created_by: user.id,
          difficulty_level: 'beginner',
          duration_weeks: 8,
          target_muscle_groups: ['Full Body', 'Core'],
          exercises: [
            {
              day: 1,
              restDay: false,
              exercises: [
                { name: "Squats", sets: "3", reps: "12-15", rest: "60s", notes: "Focus on proper form" },
                { name: "Push-ups", sets: "3", reps: "8-12", rest: "60s", notes: "Modify on knees if needed" },
                { name: "Bent-over Rows", sets: "3", reps: "10-12", rest: "60s", notes: "Use dumbbells" }
              ]
            },
            {
              day: 2,
              restDay: true,
              exercises: []
            },
            {
              day: 3,
              restDay: false,
              exercises: [
                { name: "Lunges", sets: "3", reps: "10 each leg", rest: "60s", notes: "Alternate legs" },
                { name: "Plank", sets: "3", reps: "30-45s", rest: "45s", notes: "Keep core tight" }
              ]
            }
          ]
        },
        {
          id: 'demo-plan-2',
          name: 'Intermediate Upper Body Power',
          description: 'Build upper body strength and muscle definition',
          created_by: user.id,
          difficulty_level: 'intermediate',
          duration_weeks: 6,
          target_muscle_groups: ['Chest', 'Back', 'Shoulders', 'Arms'],
          exercises: [
            {
              day: 1,
              restDay: false,
              exercises: [
                { name: "Bench Press", sets: "4", reps: "8-10", rest: "90s", notes: "Progressive overload" },
                { name: "Pull-ups", sets: "4", reps: "6-8", rest: "90s", notes: "Use assistance if needed" },
                { name: "Overhead Press", sets: "3", reps: "8-10", rest: "75s", notes: "Strict form" }
              ]
            }
          ]
        },
        {
          id: 'demo-plan-3',
          name: 'Advanced Athletic Performance',
          description: 'High-intensity training for experienced athletes',
          created_by: user.id,
          difficulty_level: 'advanced',
          duration_weeks: 12,
          target_muscle_groups: ['Full Body', 'Cardio'],
          exercises: [
            {
              day: 1,
              restDay: false,
              exercises: [
                { name: "Deadlifts", sets: "5", reps: "5", rest: "2-3min", notes: "Heavy compound movement" },
                { name: "Box Jumps", sets: "4", reps: "8", rest: "90s", notes: "Explosive power" },
                { name: "Burpees", sets: "3", reps: "15", rest: "60s", notes: "Full body conditioning" }
              ]
            }
          ]
        }
      ];

      for (const plan of mockPlans) {
        const { error: planError } = await supabase
          .from('admin_workout_plans')
          .upsert(plan);

        if (planError) {
          console.error('Error creating workout plan:', planError);
          throw planError;
        }
      }

      // 4. Create mock user workout plans
      const userPlans = [
        {
          id: 'user-plan-1',
          user_id: user.id,
          name: 'My Custom Fat Loss Plan',
          description: 'Personal plan for weight loss with cardio focus',
          fitness_goal: 'lose_weight',
          level: 1,
          duration_weeks: 6,
          exercises: [
            {
              day: 1,
              exercises: [
                { name: "Treadmill Walk", duration: "30min", activity: "Moderate pace" },
                { name: "Bodyweight Squats", sets: "3", reps: "15" },
                { name: "Push-ups (Modified)", sets: "3", reps: "8" }
              ]
            }
          ]
        },
        {
          id: 'user-plan-2',
          user_id: user.id,
          name: 'Muscle Building Journey',
          description: 'Progressive overload for muscle gain',
          fitness_goal: 'build_muscle',
          level: 2,
          duration_weeks: 10,
          exercises: [
            {
              day: 1,
              exercises: [
                { name: "Compound Lifts", sets: "4", reps: "8-10" },
                { name: "Isolation Work", sets: "3", reps: "12-15" }
              ]
            }
          ]
        }
      ];

      for (const plan of userPlans) {
        const { error: userPlanError } = await supabase
          .from('workout_plans')
          .upsert(plan);

        if (userPlanError) {
          console.error('Error creating user workout plan:', userPlanError);
          throw userPlanError;
        }
      }

      // 5. Create mock workout sessions
      const workoutSessions = [
        {
          id: 'session-1',
          user_id: user.id,
          workout_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          muscles_trained: ['Legs', 'Core'],
          duration_minutes: 45,
          notes: 'Great session, felt strong today',
          pre_workout_weight: 70.0,
          post_workout_weight: 69.8
        },
        {
          id: 'session-2',
          user_id: user.id,
          workout_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          muscles_trained: ['Chest', 'Arms'],
          duration_minutes: 60,
          notes: 'Pushed hard on bench press',
          pre_workout_weight: 70.2,
          post_workout_weight: 69.9
        }
      ];

      for (const session of workoutSessions) {
        const { error: sessionError } = await supabase
          .from('workout_sessions')
          .upsert(session);

        if (sessionError) {
          console.error('Error creating workout session:', sessionError);
          throw sessionError;
        }
      }

      // 6. Create mock subscribers entry
      const { error: subscriberError } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscribed: true,
          subscription_tier: 'premium'
        });

      if (subscriberError) {
        console.error('Error creating subscriber:', subscriberError);
        throw subscriberError;
      }

      // 7. Create mock access control
      const { error: accessError } = await supabase
        .from('user_access_control')
        .upsert({
          user_id: user.id,
          has_site_access: true,
          google_docs_file_id: '1A2B3C4D5E6F7G8H9I0J'
        });

      if (accessError) {
        console.error('Error creating access control:', accessError);
        throw accessError;
      }

      console.log('Mock data seeding completed successfully!');
      
      toast({
        title: "Success!",
        description: "Mock data has been seeded successfully. All admin functionalities should now work.",
      });

    } catch (error: any) {
      console.error('Error seeding mock data:', error);
      toast({
        title: "Error",
        description: `Failed to seed mock data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Demo Data Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>This will create comprehensive mock data for your meeting demo:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Admin workout plans with detailed exercises</li>
            <li>User-created workout plans</li>
            <li>Workout sessions and progress tracking</li>
            <li>User profiles and access controls</li>
            <li>Mock assignments and subscriptions</li>
          </ul>
        </div>
        
        <Button 
          onClick={seedMockData} 
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
              Creating Mock Data...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup Demo Data
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

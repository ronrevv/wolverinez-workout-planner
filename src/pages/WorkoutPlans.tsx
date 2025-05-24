
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Dumbbell, Target, TrendingUp, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkoutPlans();
    
    // Check for authenticated user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadUserProfile(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadWorkoutPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .order('fitness_goal', { ascending: true })
        .order('level', { ascending: true });

      if (error) throw error;
      setWorkoutPlans(data || []);
    } catch (error) {
      console.error('Error loading workout plans:', error);
      toast({
        title: "Error",
        description: "Failed to load workout plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const assignWorkoutPlan = async (planId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to assign workout plans",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, deactivate any existing assignments
      await supabase
        .from('user_workout_assignments')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then create new assignment
      const { error } = await supabase
        .from('user_workout_assignments')
        .insert({
          user_id: user.id,
          workout_plan_id: planId,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Workout Plan Assigned",
        description: "Your new workout plan has been assigned successfully!"
      });
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to assign workout plan",
        variant: "destructive"
      });
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'lose_weight':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'gain_weight':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'build_muscle':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getLevelBadge = (level: number) => {
    return level === 1 ? 'Beginner' : 'Intermediate/Advanced';
  };

  const formatGoalName = (goal: string) => {
    return goal.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRecommendedPlan = () => {
    if (!userProfile?.fitness_goal) return null;
    
    const goalPlans = workoutPlans.filter(plan => plan.fitness_goal === userProfile.fitness_goal);
    return goalPlans.find(plan => plan.level === 1); // Start with level 1
  };

  const renderWorkoutDay = (dayData: any, index: number) => (
    <div key={index} className="border rounded-lg p-3 bg-secondary/30">
      <h4 className="font-semibold mb-2">Day {dayData.day}</h4>
      <div className="space-y-1">
        {dayData.exercises.map((exercise: any, exerciseIndex: number) => (
          <div key={exerciseIndex} className="text-sm">
            <span className="font-medium">{exercise.name}</span>
            {exercise.sets && exercise.reps && (
              <span className="text-muted-foreground ml-2">
                {exercise.sets} sets × {exercise.reps} reps
              </span>
            )}
            {exercise.duration && (
              <span className="text-muted-foreground ml-2">
                {exercise.duration}
              </span>
            )}
            {exercise.activity && (
              <span className="text-muted-foreground ml-2">
                {exercise.activity}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <Navbar />
        <div className="container mx-auto mt-20 px-4 flex items-center justify-center h-96">
          <div className="text-center">
            <Dumbbell className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading workout plans...</p>
          </div>
        </div>
      </div>
    );
  }

  const recommendedPlan = getRecommendedPlan();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-block relative mb-4">
            <Target className="h-16 w-16 text-primary mx-auto" />
            <motion.div 
              className="absolute -inset-4 rounded-full bg-primary/20 z-[-1]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Workout Plans
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our expertly designed workout plans to achieve your fitness goals
          </p>
        </motion.div>

        {recommendedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="glass-card border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Badge variant="outline" className="text-yellow-600 border-yellow-500">
                    Recommended for You
                  </Badge>
                </div>
                <CardTitle className="flex items-center justify-between">
                  {recommendedPlan.name}
                  <Badge className={getGoalColor(recommendedPlan.fitness_goal)}>
                    {formatGoalName(recommendedPlan.fitness_goal)}
                  </Badge>
                </CardTitle>
                <CardDescription>{recommendedPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline">Level {recommendedPlan.level}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {recommendedPlan.duration_weeks} weeks
                  </div>
                </div>
                <Button 
                  onClick={() => assignWorkoutPlan(recommendedPlan.id)}
                  className="w-full md:w-auto"
                >
                  Start This Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="lose_weight" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lose_weight">Weight Loss</TabsTrigger>
            <TabsTrigger value="gain_weight">Weight Gain</TabsTrigger>
            <TabsTrigger value="build_muscle">Muscle Building</TabsTrigger>
          </TabsList>

          {['lose_weight', 'gain_weight', 'build_muscle'].map(goal => (
            <TabsContent key={goal} value={goal} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workoutPlans
                  .filter(plan => plan.fitness_goal === goal)
                  .map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="glass-card h-full">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <Badge variant="outline">
                              Level {plan.level}
                            </Badge>
                          </div>
                          <CardDescription>{plan.description}</CardDescription>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {plan.duration_weeks} weeks
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <h4 className="font-semibold">Weekly Schedule:</h4>
                            <div className="grid gap-2 max-h-60 overflow-y-auto">
                              {plan.exercises.slice(0, 3).map((day: any, dayIndex: number) => 
                                renderWorkoutDay(day, dayIndex)
                              )}
                              {plan.exercises.length > 3 && (
                                <div className="text-sm text-muted-foreground text-center py-2">
                                  ... and {plan.exercises.length - 3} more days
                                </div>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => assignWorkoutPlan(plan.id)}
                            className="w-full"
                            variant={plan.id === recommendedPlan?.id ? "default" : "outline"}
                          >
                            {plan.id === recommendedPlan?.id ? "Start Recommended Plan" : "Choose This Plan"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default WorkoutPlans;

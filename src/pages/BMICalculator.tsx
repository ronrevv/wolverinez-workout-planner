
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Users, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bmiHistory, setBmiHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check for authenticated user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadUserProfile(user.id);
        loadBMIHistory(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
        loadBMIHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setHeight(data.height?.toString() || "");
      setWeight(data.weight?.toString() || "");
      setAge(data.age?.toString() || "");
      setGender(data.gender || "");
      setActivityLevel(data.activity_level || "");
      setFitnessGoal(data.fitness_goal || "");
    }
  };

  const loadBMIHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('bmi_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('calculated_at', { ascending: false })
      .limit(5);

    if (data) {
      setBmiHistory(data);
    }
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-blue-600 bg-blue-100";
      case "Normal weight":
        return "text-green-600 bg-green-100";
      case "Overweight":
        return "text-yellow-600 bg-yellow-100";
      case "Obese":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateBMI = async () => {
    if (!height || !weight) {
      toast({
        title: "Missing Information",
        description: "Please enter both height and weight",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const category = getBMICategory(bmiValue);

    setBmi(bmiValue);
    setBmiCategory(category);

    // Save to database if user is logged in
    if (user) {
      try {
        // Save BMI calculation
        await supabase
          .from('bmi_calculations')
          .insert({
            user_id: user.id,
            height: parseFloat(height),
            weight: parseFloat(weight),
            bmi_value: bmiValue,
            bmi_category: category
          });

        // Update or create user profile
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const profileData = {
          user_id: user.id,
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: age ? parseInt(age) : null,
          gender: gender || null,
          activity_level: activityLevel || null,
          fitness_goal: fitnessGoal || null
        };

        if (existingProfile) {
          await supabase
            .from('user_profiles')
            .update(profileData)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_profiles')
            .insert(profileData);
        }

        // Reload BMI history
        loadBMIHistory(user.id);

        toast({
          title: "BMI Calculated",
          description: "Your BMI has been calculated and saved to your profile"
        });
      } catch (error) {
        console.error('Error saving BMI:', error);
        toast({
          title: "Error",
          description: "Failed to save BMI calculation",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "BMI Calculated",
        description: "Sign in to save your BMI history and get personalized workout plans"
      });
    }

    setIsCalculating(false);
  };

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
            <Calculator className="h-16 w-16 text-primary mx-auto" />
            <motion.div 
              className="absolute -inset-4 rounded-full bg-primary/20 z-[-1]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            BMI Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized workout recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  BMI Calculator
                </CardTitle>
                <CardDescription>
                  Enter your measurements to calculate your BMI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender (optional)</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="activity">Activity Level (optional)</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Fitness Goal (optional)</Label>
                  <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="gain_weight">Gain Weight</SelectItem>
                      <SelectItem value="build_muscle">Build Muscle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calculateBMI} 
                  className="w-full" 
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Calculate BMI"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {bmi && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your BMI Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {bmi.toFixed(1)}
                    </div>
                    <Badge className={getBMIColor(bmiCategory)}>
                      {bmiCategory}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      <p>BMI categories:</p>
                      <p>• Underweight: Below 18.5</p>
                      <p>• Normal weight: 18.5-24.9</p>
                      <p>• Overweight: 25-29.9</p>
                      <p>• Obese: 30 and above</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user && bmiHistory.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    BMI History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bmiHistory.map((record, index) => (
                      <div key={record.id} className="flex justify-between items-center p-2 rounded bg-secondary/50">
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.calculated_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.bmi_value.toFixed(1)}</span>
                          <Badge variant="outline" className="text-xs">
                            {record.bmi_category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Get More Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to save your BMI history, get personalized workout plans, and track your progress over time.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/sign-in'}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default BMICalculator;

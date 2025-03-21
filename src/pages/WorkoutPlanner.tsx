
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MuscleGroupTabs } from "@/components/MuscleGroupTabs";
import { WorkoutBuilder } from "@/components/WorkoutBuilder";
import { motion } from "framer-motion";
import { Loader2, Dumbbell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Define types
type Exercise = {
  id: number;
  name: string;
  equipment: string;
  description: string;
  difficulty: string;
};

type MuscleGroup = {
  name: string;
  exercises: Exercise[];
};

type GymData = {
  muscle_groups: MuscleGroup[];
};

const WorkoutPlanner = () => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [gymData, setGymData] = useState<GymData | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      // This is the gym exercise data
      const data: GymData = {
        muscle_groups: [
          {
            name: "Back",
            exercises: [
              {"id": 1, "name": "Lat Pulldown", "equipment": "Cable Machine", "description": "Pull the bar down to your chest, focusing on engaging your lats.", "difficulty": "beginner"},
              {"id": 2, "name": "Seated Row", "equipment": "Cable Machine", "description": "Pull the handle toward your lower chest while keeping your back straight.", "difficulty": "beginner"},
              {"id": 3, "name": "Deadlift", "equipment": "Barbell", "description": "Lift the barbell from the ground to hip level with a flat back.", "difficulty": "advanced"},
              {"id": 4, "name": "Pull-up", "equipment": "Pull-up Bar", "description": "Pull your body up until your chin clears the bar.", "difficulty": "intermediate"},
              {"id": 5, "name": "Bent Over Row", "equipment": "Barbell", "description": "Bend at the hips, keep your back straight, and pull the barbell to your lower chest.", "difficulty": "intermediate"},
              {"id": 6, "name": "T-Bar Row", "equipment": "T-Bar Machine", "description": "Pull the T-bar handle toward your lower chest.", "difficulty": "intermediate"},
              {"id": 7, "name": "Reverse Fly", "equipment": "Dumbbells", "description": "Raise the dumbbells outward while keeping a slight bend in the elbows.", "difficulty": "beginner"},
              {"id": 8, "name": "Face Pull", "equipment": "Cable Machine", "description": "Pull the rope towards your face while keeping elbows high.", "difficulty": "beginner"},
              {"id": 9, "name": "Single-Arm Dumbbell Row", "equipment": "Dumbbell", "description": "Row a dumbbell up with one arm while keeping the other hand on a bench for support.", "difficulty": "intermediate"},
              {"id": 10, "name": "Straight Arm Pulldown", "equipment": "Cable Machine", "description": "Pull the bar down in a straight motion while keeping arms extended.", "difficulty": "beginner"},
              {"id": 11, "name": "Good Morning", "equipment": "Barbell", "description": "Hinge at the hips while keeping your back straight.", "difficulty": "intermediate"},
              {"id": 12, "name": "Chin-up", "equipment": "Pull-up Bar", "description": "Pull your body up with an underhand grip until your chin clears the bar.", "difficulty": "intermediate"},
              {"id": 13, "name": "Pendlay Row", "equipment": "Barbell", "description": "Row the barbell explosively from the floor to your lower chest.", "difficulty": "advanced"},
              {"id": 14, "name": "Kettlebell Swing", "equipment": "Kettlebell", "description": "Swing the kettlebell forward by hinging at the hips.", "difficulty": "beginner"},
              {"id": 15, "name": "Reverse Grip Barbell Row", "equipment": "Barbell", "description": "Row the barbell towards your body with a supinated grip.", "difficulty": "intermediate"}
            ]
          },
          {
            name: "Chest",
            exercises: [
              {"id": 16, "name": "Bench Press", "equipment": "Barbell", "description": "Lower the barbell to your chest and press it back up.", "difficulty": "intermediate"},
              {"id": 17, "name": "Incline Bench Press", "equipment": "Barbell", "description": "Press the barbell from your upper chest on an inclined bench.", "difficulty": "intermediate"},
              {"id": 18, "name": "Decline Bench Press", "equipment": "Barbell", "description": "Press the barbell from your lower chest on a declined bench.", "difficulty": "intermediate"},
              {"id": 19, "name": "Push-up", "equipment": "Bodyweight", "description": "Lower your body to the ground and push back up, keeping your body straight.", "difficulty": "beginner"},
              {"id": 20, "name": "Dumbbell Fly", "equipment": "Dumbbells", "description": "With arms extended, lower the dumbbells out to your sides, then bring them back together.", "difficulty": "beginner"},
              {"id": 21, "name": "Cable Crossover", "equipment": "Cable Machine", "description": "Pull the cables from a wide position to cross in front of your chest.", "difficulty": "intermediate"},
              {"id": 22, "name": "Chest Dip", "equipment": "Dip Bar", "description": "Lower your body by bending your elbows, then push back up.", "difficulty": "advanced"},
              {"id": 23, "name": "Machine Chest Press", "equipment": "Chest Press Machine", "description": "Push the handles away from your chest until arms are fully extended.", "difficulty": "beginner"},
              {"id": 24, "name": "Pec Deck Machine", "equipment": "Machine", "description": "Bring the handles together in front of your chest and return slowly.", "difficulty": "beginner"},
              {"id": 25, "name": "Medicine Ball Chest Pass", "equipment": "Medicine Ball", "description": "Pass the ball explosively to a partner or wall.", "difficulty": "beginner"},
              {"id": 26, "name": "Clap Push-ups", "equipment": "Bodyweight", "description": "Perform an explosive push-up and clap your hands in midair.", "difficulty": "advanced"},
              {"id": 27, "name": "Landmine Press", "equipment": "Landmine", "description": "Press the barbell upward using a landmine attachment.", "difficulty": "intermediate"},
              {"id": 28, "name": "Svend Press", "equipment": "Weight Plate", "description": "Press a weight plate in front of your chest using both hands.", "difficulty": "beginner"},
              {"id": 29, "name": "Guillotine Press", "equipment": "Barbell", "description": "Lower the barbell to your neck while pressing with control.", "difficulty": "advanced"},
              {"id": 30, "name": "Dumbbell Pullover", "equipment": "Dumbbell", "description": "Lower the dumbbell behind your head and bring it back.", "difficulty": "intermediate"}
            ]
          },
          {
            name: "Legs",
            exercises: [
              {"id": 31, "name": "Squat", "equipment": "Barbell", "description": "Lower your body by bending your knees and hips, then push back up.", "difficulty": "intermediate"},
              {"id": 32, "name": "Leg Press", "equipment": "Leg Press Machine", "description": "Push the platform away from you using your legs.", "difficulty": "beginner"},
              {"id": 33, "name": "Lunges", "equipment": "Dumbbells", "description": "Step forward and lower your body until your knee is close to the ground.", "difficulty": "beginner"},
              {"id": 34, "name": "Romanian Deadlift", "equipment": "Barbell", "description": "Hinge at the hips while keeping your back straight.", "difficulty": "intermediate"},
              {"id": 35, "name": "Hamstring Curl", "equipment": "Leg Curl Machine", "description": "Curl the pad towards your body by bending your knees.", "difficulty": "beginner"},
              {"id": 36, "name": "Step-ups", "equipment": "Dumbbells", "description": "Step onto a bench while holding dumbbells.", "difficulty": "beginner"}
            ]
          }
        ]
      };
      
      setGymData(data);
      setLoading(false);
    }, 1500); // Simulate loading for 1.5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
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
            <Dumbbell className="h-16 w-16 text-primary mx-auto" />
            <motion.div 
              className="absolute -inset-4 rounded-full bg-primary/20 z-[-1]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Workout Planner
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Build your custom workout plan with ease and achieve your fitness goals faster
          </p>
        </motion.div>
        
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading exercise database...</p>
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="lg:col-span-2 mb-6 lg:mb-0"
              variants={itemVariants}
            >
              {gymData && (
                <MuscleGroupTabs 
                  muscleGroups={gymData.muscle_groups} 
                  selectedExercises={selectedExercises}
                  setSelectedExercises={setSelectedExercises}
                />
              )}
            </motion.div>
            
            <motion.div 
              className={cn(
                "lg:sticky lg:top-20 lg:h-[calc(100vh-100px)] lg:overflow-y-auto scrollbar-hide",
                isMobile ? "mt-6" : ""
              )}
              variants={itemVariants}
            >
              {gymData && (
                <WorkoutBuilder 
                  selectedExercises={selectedExercises}
                  setSelectedExercises={setSelectedExercises}
                  muscleGroups={gymData.muscle_groups}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WorkoutPlanner;

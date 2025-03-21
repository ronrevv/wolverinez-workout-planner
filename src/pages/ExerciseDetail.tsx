
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Video, Image as ImageIcon, Dumbbell, Activity, Music, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

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

// Mock videos and images for exercises
const mockMediaByExerciseId = (id: number) => ({
  images: [
    `https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80`,
    `https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80`,
    `https://images.unsplash.com/photo-1581122584612-713f89daa8eb?w=800&q=80`,
  ],
  videos: [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/9bZkp7q19f0"
  ],
  suggestedSongs: [
    { title: "Eye of the Tiger", artist: "Survivor", youtubeId: "btPJPFnesV4" },
    { title: "Till I Collapse", artist: "Eminem", youtubeId: "gY9C0ItyO0E" },
    { title: "Stronger", artist: "Kanye West", youtubeId: "PsO6ZnUZI0g" },
    { title: "Can't Hold Us", artist: "Macklemore", youtubeId: "2zNSgSzhBfM" }
  ]
});

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [gymData, setGymData] = useState<GymData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const isMobile = useIsMobile();

  // Get mock media for the exercise
  const media = mockMediaByExerciseId(parseInt(id || "0"));

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate loading data from an API
        setTimeout(() => {
          // This is the gym exercise data - same as in WorkoutPlanner.tsx
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

          // Find the exercise by ID
          let foundExercise: Exercise | null = null;
          let foundGroup: string = "";

          for (const group of data.muscle_groups) {
            const matchingExercise = group.exercises.find(ex => ex.id === parseInt(id || "0"));
            if (matchingExercise) {
              foundExercise = matchingExercise;
              foundGroup = group.name;
              break;
            }
          }

          if (foundExercise) {
            setExercise(foundExercise);
            setMuscleGroup(foundGroup);
            setSelectedDifficulty(foundExercise.difficulty);
          }

          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading exercise data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400 border-blue-500/30";
    }
  };

  const handleAddToWorkout = () => {
    toast.success(`Added ${exercise?.name} to your workout plan`, {
      description: "Go to the workout planner to see your selected exercises"
    });
  };

  const playSong = (youtubeId: string, title: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    toast.success(`Playing "${title}" on YouTube`, {
      description: "Opening YouTube in a new tab"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-20 px-4 flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading exercise details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto mt-20 px-4 text-center">
          <h2 className="text-2xl font-bold">Exercise not found</h2>
          <p className="text-muted-foreground mt-2">The exercise you're looking for doesn't exist.</p>
          <Button asChild className="mt-6">
            <Link to="/workout-planner">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workout Planner
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto mt-20 px-4 pb-16">
        <Button 
          variant="outline" 
          onClick={() => navigate("/workout-planner")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workout Planner
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Exercise Details Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <Badge 
                  className={cn("capitalize", getDifficultyColor(exercise.difficulty))}
                >
                  {exercise.difficulty}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {exercise.equipment}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mt-4">{exercise.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{muscleGroup}</p>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1">{exercise.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Difficulty Level</h3>
                  <Select 
                    value={selectedDifficulty} 
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={handleAddToWorkout}
              >
                Add to Workout
              </Button>
            </div>
          </div>
          
          {/* Media Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Exercise Images</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {media.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-video rounded-md overflow-hidden"
                  >
                    <img 
                      src={img} 
                      alt={`${exercise.name} demonstration ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Videos */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Exercise Videos</h2>
              </div>
              
              <div className="space-y-4">
                {media.videos.map((videoUrl, idx) => (
                  <div key={idx} className="aspect-video rounded-md overflow-hidden">
                    <iframe
                      src={videoUrl}
                      title={`${exercise.name} video ${idx + 1}`}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Songs */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Workout Music</h2>
              </div>
              
              <div className="space-y-2">
                {media.suggestedSongs.map((song, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--primary), 0.05)" }}
                    className="p-3 rounded-md flex justify-between items-center border border-border/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="rounded-full h-9 w-9 p-0 flex items-center justify-center hover:bg-primary/20 hover:text-primary hover:border-primary/30"
                      onClick={() => playSong(song.youtubeId, song.title)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Similar Exercises */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Similar Exercises</h2>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {gymData?.muscle_groups
                  .find(group => group.name === muscleGroup)
                  ?.exercises
                  .filter(ex => ex.id !== exercise.id)
                  .slice(0, 5)
                  .map(similarExercise => (
                    <AccordionItem key={similarExercise.id} value={similarExercise.id.toString()}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={cn("capitalize text-xs", getDifficultyColor(similarExercise.difficulty))}
                          >
                            {similarExercise.difficulty}
                          </Badge>
                          <span>{similarExercise.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <p className="text-sm">{similarExercise.description}</p>
                          <p className="text-xs text-muted-foreground">Equipment: {similarExercise.equipment}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            className="mt-2"
                          >
                            <Link to={`/exercise/${similarExercise.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExerciseDetail;

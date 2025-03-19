
import { useState } from "react";
import { X, Plus, Trash, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { WorkoutExport } from "./WorkoutExport";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

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

type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

interface WorkoutBuilderProps {
  selectedExercises: Exercise[];
  setSelectedExercises: (exercises: Exercise[]) => void;
  muscleGroups: MuscleGroup[];
}

export function WorkoutBuilder({ selectedExercises, setSelectedExercises, muscleGroups }: WorkoutBuilderProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Create a new workout
  const createWorkout = () => {
    if (!newWorkoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }
    
    if (selectedExercises.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }
    
    const newWorkout: Workout = {
      id: generateId(),
      name: newWorkoutName,
      exercises: [...selectedExercises],
    };
    
    setWorkouts([...workouts, newWorkout]);
    setNewWorkoutName("");
    setSelectedExercises([]);
    
    toast.success(`Created workout: ${newWorkoutName}`);
  };

  // Remove an exercise from the selected list
  const removeSelectedExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  // Remove a workout
  const removeWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
    toast.success("Workout removed");
  };

  // Helper function to get muscle group for an exercise
  const getMuscleGroupForExercise = (exerciseId: number): string => {
    for (const group of muscleGroups) {
      if (group.exercises.some(e => e.id === exerciseId)) {
        return group.name;
      }
    }
    return "Other";
  };

  // Group exercises by muscle group
  const groupExercisesByMuscle = (exercises: Exercise[]) => {
    const grouped: Record<string, Exercise[]> = {};
    
    exercises.forEach(exercise => {
      const muscleGroup = getMuscleGroupForExercise(exercise.id);
      if (!grouped[muscleGroup]) {
        grouped[muscleGroup] = [];
      }
      grouped[muscleGroup].push(exercise);
    });
    
    return grouped;
  };

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

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden transition-all duration-300 shadow-sm">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer bg-secondary/50 dark:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Workout Builder</h3>
          {selectedExercises.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedExercises.length} selected
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
          {isExpanded ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                placeholder="Enter workout name"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={createWorkout}
                disabled={selectedExercises.length === 0 || !newWorkoutName.trim()}
                className="w-full sm:w-auto"
              >
                Create
              </Button>
            </div>
            
            {selectedExercises.length > 0 ? (
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <Accordion type="multiple" defaultValue={muscleGroups.map(g => g.name)} className="w-full">
                  {Object.entries(groupExercisesByMuscle(selectedExercises)).map(([muscleGroup, exercises]) => (
                    <AccordionItem key={muscleGroup} value={muscleGroup}>
                      <AccordionTrigger className="py-2 px-1">
                        <div className="flex items-center">
                          <span className="font-medium">{muscleGroup}</span>
                          <Badge variant="secondary" className="ml-2">
                            {exercises.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <AnimatePresence>
                          {exercises.map((exercise) => (
                            <motion.div
                              key={exercise.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between py-2 px-3 hover:bg-secondary/50 dark:hover:bg-muted/50 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline"
                                  className={cn("capitalize text-xs", getDifficultyColor(exercise.difficulty))}
                                >
                                  {exercise.difficulty}
                                </Badge>
                                <span className="text-sm font-medium">{exercise.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => removeSelectedExercise(exercise.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            ) : (
              <div className="h-[150px] flex items-center justify-center border rounded-md bg-secondary/20 dark:bg-muted/20">
                <p className="text-muted-foreground text-sm">
                  Select exercises from the tabs above
                </p>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h4 className="font-medium">Saved Workouts</h4>
            
            {workouts.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {workouts.map((workout) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{workout.name}</CardTitle>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the "{workout.name}" workout and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeWorkout(workout.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <CardDescription>
                            {workout.exercises.length} exercises
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className={isMobile ? "h-[150px]" : "h-[100px]"}>
                            <Accordion type="multiple" defaultValue={muscleGroups.map(g => g.name)} className="w-full">
                              {Object.entries(groupExercisesByMuscle(workout.exercises)).map(([muscleGroup, exercises]) => (
                                <AccordionItem key={muscleGroup} value={muscleGroup}>
                                  <AccordionTrigger className="py-2 px-1">
                                    <div className="flex items-center">
                                      <span className="font-medium">{muscleGroup}</span>
                                      <Badge variant="secondary" className="ml-2">
                                        {exercises.length}
                                      </Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    {exercises.map((exercise) => (
                                      <div 
                                        key={exercise.id}
                                        className="flex items-center gap-2 py-1"
                                      >
                                        <Badge 
                                          variant="outline" 
                                          className={cn("capitalize text-xs", getDifficultyColor(exercise.difficulty))}
                                        >
                                          {exercise.difficulty}
                                        </Badge>
                                        <span className="text-sm">{exercise.name}</span>
                                      </div>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="pt-2">
                  <WorkoutExport workouts={workouts} muscleGroups={muscleGroups} />
                </div>
              </div>
            ) : (
              <div className="h-[100px] flex items-center justify-center border rounded-md bg-secondary/20 dark:bg-muted/20">
                <p className="text-muted-foreground text-sm">
                  No workouts created yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

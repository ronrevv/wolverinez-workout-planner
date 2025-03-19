
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseCard } from "./ExerciseCard";
import { motion } from "framer-motion";

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

interface MuscleGroupTabsProps {
  muscleGroups: MuscleGroup[];
  selectedExercises: Exercise[];
  setSelectedExercises: (exercises: Exercise[]) => void;
}

export function MuscleGroupTabs({ 
  muscleGroups, 
  selectedExercises, 
  setSelectedExercises 
}: MuscleGroupTabsProps) {
  const [activeTab, setActiveTab] = useState(muscleGroups[0]?.name || "");

  const toggleExerciseSelection = (exercise: Exercise) => {
    if (selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const isExerciseSelected = (id: number) => {
    return selectedExercises.some(e => e.id === id);
  };

  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm pt-4 pb-2 border-b border-border">
        <TabsList className="w-full flex overflow-x-auto justify-start gap-2 h-auto p-1 bg-secondary/50 dark:bg-muted/50 scrollbar-hide">
          {muscleGroups.map((group) => (
            <TabsTrigger
              key={group.name}
              value={group.name}
              className="px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {muscleGroups.map((group) => (
        <TabsContent 
          key={group.name} 
          value={group.name}
          className="mt-6 focus-visible:outline-none focus-visible:ring-0"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isSelected={isExerciseSelected(exercise.id)}
                  onSelect={toggleExerciseSelection}
                />
              ))}
            </div>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

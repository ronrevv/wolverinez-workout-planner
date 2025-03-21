
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseCard } from "./ExerciseCard";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<{[key: string]: Exercise[]}>({});

  // Filter exercises based on search query
  useEffect(() => {
    const filtered: {[key: string]: Exercise[]} = {};
    
    muscleGroups.forEach(group => {
      if (searchQuery.trim() === "") {
        filtered[group.name] = group.exercises;
      } else {
        filtered[group.name] = group.exercises.filter(exercise => 
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    });
    
    setFilteredExercises(filtered);
  }, [searchQuery, muscleGroups]);

  const toggleExerciseSelection = (exercise: Exercise) => {
    console.log("Toggling exercise:", exercise.name);
    if (selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const isExerciseSelected = (id: number) => {
    return selectedExercises.some(e => e.id === id);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm pt-4 pb-2 border-b border-border">
        <div className="mb-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises, equipment, difficulty..."
              className="pl-10 pr-10 bg-secondary/50 border-secondary focus-visible:ring-primary/30"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <TabsList className="w-full flex overflow-x-auto justify-start gap-2 h-auto p-1 bg-secondary/50 dark:bg-muted/50 scrollbar-hide">
          {muscleGroups.map((group) => (
            <TabsTrigger
              key={group.name}
              value={group.name}
              className={cn(
                "px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                filteredExercises[group.name]?.length === 0 && searchQuery ? "opacity-50" : ""
              )}
            >
              {group.name}
              {searchQuery && filteredExercises[group.name] && (
                <span className="ml-2 bg-primary/20 text-xs px-1.5 py-0.5 rounded-full">
                  {filteredExercises[group.name].length}
                </span>
              )}
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
            {filteredExercises[group.name]?.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No exercises found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredExercises[group.name] || group.exercises).map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isSelected={isExerciseSelected(exercise.id)}
                    onSelect={toggleExerciseSelection}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

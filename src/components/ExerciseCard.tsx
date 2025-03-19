
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Dumbbell, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Exercise = {
  id: number;
  name: string;
  equipment: string;
  description: string;
  difficulty: string;
};

interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, isSelected, onSelect }: ExerciseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get badge color based on difficulty
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-in-out glass-card",
          isSelected ? "ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10" : "",
          isHovered ? "translate-y-[-4px] shadow-lg" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge 
              variant="outline"
              className={cn("capitalize font-medium border", 
                getDifficultyColor(exercise.difficulty)
              )}
            >
              {exercise.difficulty}
            </Badge>
            
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <CheckCircle className="h-5 w-5 text-primary" />
              </motion.div>
            )}
          </div>
          <CardTitle className="text-xl mt-2 line-clamp-1">{exercise.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
            <span>{exercise.equipment}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-foreground/90 line-clamp-2 h-10">
            {exercise.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{exercise.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            variant={isSelected ? "secondary" : "default"}
            size="sm" 
            className={cn(
              "transition-all duration-300",
              isSelected ? "bg-primary/90 hover:bg-primary/80" : ""
            )}
            onClick={() => onSelect(exercise)}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

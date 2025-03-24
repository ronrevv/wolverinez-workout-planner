
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Dumbbell, Info, Clock } from "lucide-react";
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
  const navigate = useNavigate();
  
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

  // Get estimated time based on difficulty
  const getEstimatedTime = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "3-5 min";
      case "intermediate":
        return "5-8 min";
      case "advanced":
        return "8-12 min";
      default:
        return "5 min";
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(exercise);
    console.log("Exercise selected:", exercise.name);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate programmatically to ensure the route change happens
    navigate(`/exercise/${exercise.id}`);
    console.log("Navigating to exercise details:", exercise.id);
  };

  // Add a card click handler to make the entire card clickable for selection
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on link or button elements
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    onSelect(exercise);
    console.log("Card clicked for:", exercise.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-in-out glass-card card-highlight cursor-pointer",
          isSelected ? "ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10" : "",
          isHovered ? "translate-y-[-4px] shadow-lg" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2 relative">
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute top-3 right-3"
            >
              <div className="bg-primary/10 rounded-full p-1">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-between items-start">
            <Badge 
              variant="outline"
              className={cn("capitalize font-medium border w-fit", 
                getDifficultyColor(exercise.difficulty)
              )}
            >
              {exercise.difficulty}
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{getEstimatedTime(exercise.difficulty)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated time per set</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <CardTitle className="text-xl mt-2 line-clamp-1 group">
            {exercise.name}
            <span className="block h-0.5 w-0 group-hover:w-full bg-primary/60 transition-all duration-300" />
          </CardTitle>
          
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 hover:bg-primary/20 info-button z-10"
            onClick={handleInfoClick}
          >
            <Info className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isSelected ? "secondary" : "default"}
            size="sm" 
            className={cn(
              "transition-all duration-300 z-10",
              isSelected ? "bg-primary/90 hover:bg-primary/80" : ""
            )}
            onClick={handleSelect}
          >
            {isSelected ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Selected
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Select
              </motion.span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

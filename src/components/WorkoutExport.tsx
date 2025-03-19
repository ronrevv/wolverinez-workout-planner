
import { useState, useRef } from "react";
import { Save, Download, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Exercise = {
  id: number;
  name: string;
  equipment: string;
  description: string;
  difficulty: string;
};

type Workout = {
  name: string;
  exercises: Exercise[];
};

interface WorkoutExportProps {
  workouts: Workout[];
}

export function WorkoutExport({ workouts }: WorkoutExportProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Generate workout text content
  const generateWorkoutText = () => {
    if (workouts.length === 0) return "No workouts created yet";
    
    let content = "WOLVERINEZ WORKOUT PLAN\n\n";
    
    workouts.forEach((workout, index) => {
      content += `WORKOUT ${index + 1}: ${workout.name}\n`;
      content += "=====================================\n\n";
      
      workout.exercises.forEach((exercise, idx) => {
        content += `${idx + 1}. ${exercise.name}\n`;
        content += `   Equipment: ${exercise.equipment}\n`;
        content += `   Difficulty: ${exercise.difficulty}\n`;
        content += `   Description: ${exercise.description}\n\n`;
      });
      
      content += "\n";
    });
    
    content += "Created with Wolverinez Workout Planner";
    return content;
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    if (textAreaRef.current) {
      navigator.clipboard.writeText(textAreaRef.current.value)
        .then(() => {
          setCopied(true);
          toast.success("Workout copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast.error("Failed to copy to clipboard");
        });
    }
  };

  // Download workout as text file
  const downloadWorkout = () => {
    const element = document.createElement("a");
    const file = new Blob([generateWorkoutText()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "wolverinez_workout_plan.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Workout downloaded successfully!");
    setOpen(false);
  };

  // If no workouts, show disabled button
  if (workouts.length === 0) {
    return (
      <Button disabled className="w-full" variant="outline">
        <Save className="mr-2 h-4 w-4" />
        Export Workout
      </Button>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <Save className="mr-2 h-4 w-4" />
        Export Workout
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Export Your Workout</DialogTitle>
            <DialogDescription>
              Your custom workout plan is ready. You can copy it to clipboard or download it as a text file.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="mt-4 h-[300px] rounded-md border p-4">
            <textarea
              ref={textAreaRef}
              readOnly
              className="w-full h-full resize-none outline-none bg-transparent font-mono text-sm"
              value={generateWorkoutText()}
            />
          </ScrollArea>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            
            <Button 
              onClick={downloadWorkout}
              className="flex-1 sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

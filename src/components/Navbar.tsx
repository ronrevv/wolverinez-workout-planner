
import { ThemeToggle } from "./ThemeToggle";
import { Dumbbell, Info, Users, LogIn, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Wolverinez
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/membership" className="text-sm font-medium hover:text-primary transition-colors">
              Membership
            </Link>
            <Link to="/advanced-plans" className="text-sm font-medium hover:text-primary transition-colors">
              Advanced Plans
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

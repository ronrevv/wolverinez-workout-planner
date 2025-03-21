
import { ThemeToggle } from "./ThemeToggle";
import { Dumbbell, Info, Users, LogIn, Star, BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300",
        isScrolled 
          ? "bg-background/90 border-b border-border py-2" 
          : "bg-background/50 py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Dumbbell className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-12" />
                <motion.div 
                  className="absolute -inset-1 rounded-full bg-primary/20 z-[-1]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                />
              </div>
              <span className="font-bold text-xl gradient-text">
                Wolverinez
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/membership" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Membership
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/advanced-plans" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Advanced Plans
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm" asChild className="hover:border-primary/50">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="animate-pulse-slow">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 border-t border-border/50">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/about" 
                  className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/membership" 
                  className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Membership
                </Link>
                <Link 
                  to="/advanced-plans" 
                  className="text-sm font-medium p-2 hover:bg-primary/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Advanced Plans
                </Link>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

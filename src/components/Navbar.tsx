
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, User, Shield, Award, Calculator, FileText, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { to: '/', label: 'Home', icon: Dumbbell },
    { to: '/about', label: 'About', icon: FileText },
    { to: '/bmi-calculator', label: 'BMI Calculator', icon: Calculator },
    { to: '/workout-plans', label: 'Workout Plans', icon: Target },
  ];

  const userNavItems = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/my-plans', label: 'My Plans', icon: Target },
    { to: '/workout-planner', label: 'Planner', icon: Dumbbell },
  ];

  const adminNavItems = [
    { to: '/admin', label: 'Admin', icon: Shield },
  ];

  const trainerNavItems = [
    { to: '/trainer', label: 'Trainer', icon: Award },
  ];

  const getAllNavItems = () => {
    let items = [...publicNavItems];
    
    if (user) {
      items = [...items, ...userNavItems];
      
      if (userRole === 'admin') {
        items = [...items, ...adminNavItems];
      }
      
      if (userRole === 'trainer' || userRole === 'admin') {
        items = [...items, ...trainerNavItems];
      }
    }
    
    return items;
  };

  const navItems = getAllNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="gradient-text">FitnessPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                  {userRole && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {userRole}
                    </span>
                  )}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.to)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {userRole && (
                        <p className="text-xs text-primary">{userRole}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full mx-3"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

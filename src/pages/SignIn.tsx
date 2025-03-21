
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Lock, Mail, LogIn } from "lucide-react";

const SignIn = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle authentication here
    toast({
      title: "Sign in successful",
      description: "Welcome back to Wolverinez!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card overflow-hidden">
            <CardHeader className="space-y-1 relative pb-8">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 z-[-1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="mx-auto bg-white dark:bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-1">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-center mt-2">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your Wolverinez account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="yourname@example.com" 
                    required
                    className="bg-background/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Link to="#" className="text-xs text-primary hover:text-primary/80 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    className="bg-background/50 focus:border-primary"
                  />
                </div>
                <Button type="submit" className="w-full group">
                  <LogIn className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  Sign in
                </Button>
              </form>
              
              <div className="my-4 flex items-center">
                <div className="flex-grow h-px bg-muted"></div>
                <span className="px-3 text-xs text-muted-foreground">OR</span>
                <div className="flex-grow h-px bg-muted"></div>
              </div>
              
              <Button variant="outline" className="w-full hover:bg-secondary/50">
                <motion.img 
                  src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-icon.svg"
                  className="h-4 w-4 mr-2"
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                />
                Continue with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-xs text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default SignIn;

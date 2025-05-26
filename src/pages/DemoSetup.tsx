
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockDataSeeder } from "@/components/MockDataSeeder";
import { Navbar } from "@/components/Navbar";
import { Database, Presentation, CheckCircle } from "lucide-react";

const DemoSetup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Presentation className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold gradient-text">Demo Setup</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prepare your FitnessPro application with comprehensive mock data for the perfect demo presentation.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  What This Demo Setup Includes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Admin Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• User management with role assignments</li>
                      <li>• Professional workout plan creation</li>
                      <li>• Plan assignment system</li>
                      <li>• Access control management</li>
                      <li>• Google Docs integration demo</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Trainer Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Advanced workout plan builder</li>
                      <li>• Client assignment workflow</li>
                      <li>• Progress tracking tools</li>
                      <li>• Exercise library integration</li>
                      <li>• Professional plan templates</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">User Experience</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Personal workout tracking</li>
                      <li>• Assigned plan management</li>
                      <li>• Progress visualization</li>
                      <li>• Custom plan creation</li>
                      <li>• Workout session logging</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">Data & Analytics</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Realistic workout data</li>
                      <li>• Weight tracking history</li>
                      <li>• BMI calculations</li>
                      <li>• Gym attendance records</li>
                      <li>• User subscription management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MockDataSeeder />

            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Next Steps After Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium">Navigate to Admin Dashboard</p>
                      <p className="text-sm text-muted-foreground">Access comprehensive user management and plan creation tools</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium">Explore Trainer Features</p>
                      <p className="text-sm text-muted-foreground">Create and assign professional workout plans to users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</div>
                    <div>
                      <p className="font-medium">Demonstrate User Experience</p>
                      <p className="text-sm text-muted-foreground">Show personal plans, tracking, and assigned workout management</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoSetup;

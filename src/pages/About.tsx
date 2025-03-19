
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Users, Award, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-2">
            About Wolverinez
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're dedicated to helping you achieve your fitness goals with personalized workout plans and expert guidance.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
                <CardDescription>How Wolverinez came to be</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Founded in 2023, Wolverinez was created by a team of fitness enthusiasts who wanted to make personalized workout planning accessible to everyone. Our platform combines innovative technology with exercise science to deliver custom workout routines that fit your specific needs and goals.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>What drives us forward</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  At Wolverinez, we believe that fitness should be accessible and tailored to individual needs. Our mission is to empower everyone to take control of their fitness journey with smart, personalized workout plans that evolve as you progress.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: Dumbbell, 
              title: "Expert-Designed",
              description: "Workouts created by certified fitness professionals"
            },
            { 
              icon: Users, 
              title: "Community",
              description: "Join thousands of members on their fitness journeys"
            },
            { 
              icon: Award, 
              title: "Results",
              description: "Proven plans that deliver measurable results"
            },
            { 
              icon: Clock, 
              title: "Flexibility",
              description: "Customize workouts that fit your schedule"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default About;

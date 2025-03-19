
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Utensils, BarChart3, HeartPulse, Calendar, Book } from "lucide-react";
import { Link } from "react-router-dom";

const AdvancedPlans = () => {
  const plans = [
    {
      title: "Diet Plan",
      price: "₹1999",
      period: "one-time",
      description: "Personalized nutrition plan based on your goals",
      icon: Utensils,
      features: [
        "Detailed nutrition guidance",
        "Meal planning for your goals",
        "Supplement recommendations",
        "14-day meal plan with recipes",
        "Grocery shopping lists"
      ],
      button: "Get Diet Plan",
      link: "/diet-request",
      badge: "Popular"
    },
    {
      title: "Full Body Transformation",
      price: "₹4999",
      period: "3 months",
      description: "Complete program for serious results",
      icon: HeartPulse,
      features: [
        "Personalized workout routine",
        "Custom nutrition plan",
        "Weekly check-ins with coach",
        "Progress tracking tools",
        "Supplement guide"
      ],
      button: "Start Transformation",
      link: "/diet-request",
      badge: null
    },
    {
      title: "Performance Coaching",
      price: "₹3499",
      period: "monthly",
      description: "For athletes and advanced fitness enthusiasts",
      icon: BarChart3,
      features: [
        "Sport-specific training",
        "Performance nutrition",
        "Recovery protocols",
        "Mobility routines",
        "Bi-weekly coaching calls"
      ],
      button: "Get Coaching",
      link: "/diet-request",
      badge: null
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-2">
            Advanced Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your fitness to the next level with our premium services
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="flex"
            >
              <Card className="flex flex-col w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="rounded-full bg-primary/10 p-3">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                    {plan.badge && (
                      <Badge variant="default" className="bg-primary">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{plan.title}</CardTitle>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    asChild
                  >
                    <Link to={plan.link}>{plan.button}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Calendar,
                title: "Book Consultation",
                description: "Schedule a call with our fitness experts to discuss your goals"
              },
              {
                icon: Star,
                title: "Custom Plan",
                description: "Receive your personalized plan designed for your specific needs"
              },
              {
                icon: Book,
                title: "Execute & Track",
                description: "Follow your plan and track progress with our trainers"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className="text-center"
              >
                <div className="rounded-full bg-primary/10 p-4 mx-auto w-fit mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvancedPlans;

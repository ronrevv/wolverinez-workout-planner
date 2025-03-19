
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Membership = () => {
  const plans = [
    {
      title: "Basic",
      price: "Free",
      description: "Get started with basic workout planning",
      features: [
        "Access to exercise library",
        "Basic workout builder",
        "Save up to 3 workout plans",
        "Export workout plans as PDF"
      ],
      button: "Get Started",
      link: "/sign-up",
      popular: false
    },
    {
      title: "Premium",
      price: "₹599/month",
      description: "Everything you need for serious training",
      features: [
        "All Basic features",
        "Unlimited workout plans",
        "Advanced exercise tracking",
        "Progress analytics",
        "Save workout history"
      ],
      button: "Go Premium",
      link: "/sign-up",
      popular: true
    },
    {
      title: "Pro",
      price: "₹1499/month",
      description: "For advanced athletes and professionals",
      features: [
        "All Premium features",
        "Personalized diet plans",
        "1-on-1 coaching sessions",
        "Advanced analytics",
        "Priority support"
      ],
      button: "Go Pro",
      link: "/advanced-plans",
      popular: false
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
            Membership Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your fitness journey
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
              <Card className={`flex flex-col w-full border ${plan.popular ? 'border-primary' : 'border-border'}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-b-md w-fit mx-auto">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
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
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.link}>{plan.button}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Can I change plans later?</h3>
              <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Is there a contract or commitment?</h3>
              <p className="text-sm text-muted-foreground">No, all our plans are month-to-month with no long-term commitment. You can cancel anytime.</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">How do I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">You can cancel your subscription from your account settings. Your access will continue until the end of your current billing period.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Membership;


import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DietRequest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // This function would typically load the Razorpay SDK and initiate payment
  const initiatePayment = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real implementation, you would:
      // 1. Call your backend to create an order
      // 2. Get order_id and other details from backend
      // 3. Initialize Razorpay with those details
      
      const options = {
        key: "rzp_test_YOUR_KEY_ID", // Replace with actual Razorpay test key in production
        amount: "199900", // amount in paise (₹1999)
        currency: "INR",
        name: "Wolverinez Fitness",
        description: "Payment for Custom Diet Plan",
        image: "https://your-logo-url.png", // Replace with your logo
        handler: function(response: any) {
          // Handle successful payment
          toast({
            title: "Payment Successful!",
            description: "Your diet plan request has been received. We'll contact you soon!",
          });
          setLoading(false);
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210"
        },
        theme: {
          color: "#7C3AED" // Your primary color
        }
      };
      
      // This would be actual Razorpay integration in a real app
      // const razorpay = new window.Razorpay(options);
      // razorpay.open();
      
      // For demo, we'll just show success
      toast({
        title: "Payment Successful! (Demo)",
        description: "This is a demo. In a real app, Razorpay payment would be processed.",
      });
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiatePayment();
  };

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
            Request Custom Diet Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a personalized diet plan designed specifically for your goals
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Premium Service</AlertTitle>
            <AlertDescription>
              This is a premium service priced at ₹1999. You'll be redirected to our secure payment gateway after submitting this form.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Please provide your details to help us create a personalized diet plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" min="16" max="100" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" min="100" max="250" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" min="30" max="250" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="performance">Athletic Performance</SelectItem>
                      <SelectItem value="health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days per week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days per week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days per week)</SelectItem>
                      <SelectItem value="very-active">Very Active (twice per day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Dietary Restrictions or Allergies</Label>
                  <Textarea id="allergies" placeholder="List any food allergies or dietary restrictions" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Any other information you'd like us to know" />
                </div>
                
                <CardFooter className="px-0 pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Proceed to Payment (₹1999)"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DietRequest;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkoutPlanner from "./pages/WorkoutPlanner";
import ExerciseDetail from "./pages/ExerciseDetail";
import About from "./pages/About";
import Membership from "./pages/Membership";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdvancedPlans from "./pages/AdvancedPlans";
import DietRequest from "./pages/DietRequest";
import BMICalculator from "./pages/BMICalculator";
import WorkoutPlans from "./pages/WorkoutPlans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workout-planner" element={<WorkoutPlanner />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/advanced-plans" element={<AdvancedPlans />} />
          <Route path="/diet-request" element={<DietRequest />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/workout-plans" element={<WorkoutPlans />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

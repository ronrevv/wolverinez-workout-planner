
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
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import MyPlans from "./pages/MyPlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/trainer" element={<TrainerDashboard />} />
            <Route path="/my-plans" element={<MyPlans />} />
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

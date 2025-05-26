
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { TrainerDashboard as TrainerDashboardComponent } from "@/components/TrainerDashboard";

const TrainerDashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto mt-20 px-4 pb-16">
        <TrainerDashboardComponent />
      </main>
    </div>
  );
};

export default TrainerDashboard;

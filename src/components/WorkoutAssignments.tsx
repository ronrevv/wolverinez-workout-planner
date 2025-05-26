
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Users, Dumbbell, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty_level: string;
  duration_weeks: number;
}

interface User {
  user_id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: string;
  workout_plan_name: string;
  assigned_to_name: string;
  assigned_to_email: string;
  assigned_at: string;
  status: string;
  notes: string;
}

const WorkoutAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load workout plans
      const { data: plansData, error: plansError } = await supabase
        .from('admin_workout_plans')
        .select('id, name, description, difficulty_level, duration_weeks')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setWorkoutPlans(plansData || []);

      // Load users from profiles and subscribers
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, name');

      if (profilesError) throw profilesError;

      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('user_id, email');

      if (subscribersError) throw subscribersError;

      // Combine user data
      const combinedUsers = profilesData?.map(profile => {
        const subscriber = subscribersData?.find(s => s.user_id === profile.user_id);
        return {
          user_id: profile.user_id,
          name: profile.name || 'Unknown',
          email: subscriber?.email || 'Unknown'
        };
      }).filter(user => user.user_id !== user?.id) || []; // Exclude current admin

      setUsers(combinedUsers);

      // Load existing assignments
      await loadAssignments();
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const { data: assignmentsData, error } = await supabase
        .from('workout_plan_assignments')
        .select(`
          id,
          assigned_at,
          status,
          notes,
          admin_workout_plans(name),
          assigned_to_user
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;

      // Get user details for assignments
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('user_id, name');

      const { data: subscribersData } = await supabase
        .from('subscribers')
        .select('user_id, email');

      const enrichedAssignments = assignmentsData?.map(assignment => {
        const profile = profilesData?.find(p => p.user_id === assignment.assigned_to_user);
        const subscriber = subscribersData?.find(s => s.user_id === assignment.assigned_to_user);
        
        return {
          id: assignment.id,
          workout_plan_name: assignment.admin_workout_plans?.name || 'Unknown Plan',
          assigned_to_name: profile?.name || 'Unknown',
          assigned_to_email: subscriber?.email || 'Unknown',
          assigned_at: assignment.assigned_at,
          status: assignment.status,
          notes: assignment.notes || ''
        };
      }) || [];

      setAssignments(enrichedAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const assignWorkoutPlan = async () => {
    if (!selectedPlan || selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select a workout plan and at least one user",
        variant: "destructive"
      });
      return;
    }

    setAssigning(true);
    try {
      const assignments = selectedUsers.map(userId => ({
        workout_plan_id: selectedPlan,
        assigned_to_user: userId,
        assigned_by: user?.id,
        notes: assignmentNotes,
        status: 'active'
      }));

      const { error } = await supabase
        .from('workout_plan_assignments')
        .insert(assignments);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Workout plan assigned to ${selectedUsers.length} user(s)`,
      });

      // Reset form
      setSelectedPlan('');
      setSelectedUsers([]);
      setAssignmentNotes('');
      
      // Reload assignments
      await loadAssignments();
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to assign workout plan",
        variant: "destructive"
      });
    } finally {
      setAssigning(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Assign Workout Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Workout Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a workout plan" />
              </SelectTrigger>
              <SelectContent>
                {workoutPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} ({plan.difficulty_level} - {plan.duration_weeks} weeks)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Users</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto mt-2">
              {users.map((user) => (
                <div key={user.user_id} className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id={user.user_id}
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={() => toggleUserSelection(user.user_id)}
                    className="rounded"
                  />
                  <label htmlFor={user.user_id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes for this assignment..."
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
            />
          </div>

          <Button 
            onClick={assignWorkoutPlan} 
            disabled={assigning || !selectedPlan || selectedUsers.length === 0}
            className="w-full"
          >
            {assigning ? "Assigning..." : `Assign to ${selectedUsers.length} user(s)`}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workout Plan</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.workout_plan_name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{assignment.assigned_to_name}</div>
                      <div className="text-sm text-muted-foreground">{assignment.assigned_to_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{assignment.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export { WorkoutAssignments };

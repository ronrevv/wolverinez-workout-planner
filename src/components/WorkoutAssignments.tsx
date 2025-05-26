
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
      console.log('Loading workout assignments data...');
      
      // Load workout plans
      const { data: plansData, error: plansError } = await supabase
        .from('admin_workout_plans')
        .select('id, name, description, difficulty_level, duration_weeks')
        .order('created_at', { ascending: false });

      if (plansError) {
        console.error('Error loading plans:', plansError);
        throw plansError;
      }
      
      console.log('Loaded plans:', plansData?.length || 0);
      setWorkoutPlans(plansData || []);

      // Load users from subscribers table (these are the actual users)
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('user_id, email');

      if (subscribersError) {
        console.error('Error loading subscribers:', subscribersError);
        throw subscribersError;
      }

      // Load user profiles for names
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, name');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        // Continue without names if profiles fail
      }

      // Combine user data and exclude current user
      const combinedUsers = subscribersData?.map(subscriber => {
        const profile = profilesData?.find(p => p.user_id === subscriber.user_id);
        return {
          user_id: subscriber.user_id,
          name: profile?.name || 'Unknown User',
          email: subscriber.email
        };
      }).filter(userData => 
        userData.user_id !== user?.id && // Exclude current user
        userData.email !== 'Unknown' // Exclude users without email
      ) || [];

      console.log('Available users for assignment:', combinedUsers.length);
      setUsers(combinedUsers);

      // Load existing assignments
      await loadAssignments();
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      console.log('Loading assignments...');
      
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

      if (error) {
        console.error('Error loading assignments:', error);
        throw error;
      }

      console.log('Raw assignments data:', assignmentsData);

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

      console.log('Enriched assignments:', enrichedAssignments.length);
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

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to assign workout plans",
        variant: "destructive"
      });
      return;
    }

    setAssigning(true);
    try {
      console.log('Assigning workout plan:', selectedPlan, 'to users:', selectedUsers);
      
      const assignments = selectedUsers.map(userId => ({
        workout_plan_id: selectedPlan,
        assigned_to_user: userId,
        assigned_by: user.id,
        notes: assignmentNotes || null,
        status: 'active'
      }));

      const { data, error } = await supabase
        .from('workout_plan_assignments')
        .insert(assignments)
        .select();

      if (error) {
        console.error('Error inserting assignments:', error);
        throw error;
      }

      console.log('Assignments created successfully:', data);

      toast({
        title: "Success",
        description: `Workout plan assigned to ${selectedUsers.length} user(s) successfully!`,
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
        description: "Failed to assign workout plan. Please try again.",
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
            Assign Workout Plans to Users
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
                {workoutPlans.length === 0 ? (
                  <SelectItem value="no-plans" disabled>
                    No workout plans available
                  </SelectItem>
                ) : (
                  workoutPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} ({plan.difficulty_level} - {plan.duration_weeks} weeks)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Users ({users.length} available)</Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto mt-2">
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No users available for assignment
                </p>
              ) : (
                users.map((userData) => (
                  <div key={userData.user_id} className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id={userData.user_id}
                      checked={selectedUsers.includes(userData.user_id)}
                      onChange={() => toggleUserSelection(userData.user_id)}
                      className="rounded"
                    />
                    <label htmlFor={userData.user_id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{userData.name}</div>
                      <div className="text-sm text-muted-foreground">{userData.email}</div>
                    </label>
                  </div>
                ))
              )}
            </div>
            {users.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedUsers.length} of {users.length} users selected
              </p>
            )}
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
            Recent Assignments ({assignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No assignments yet. Create your first assignment above.
            </p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { WorkoutAssignments };

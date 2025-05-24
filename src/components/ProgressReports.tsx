
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Target, Activity } from "lucide-react";
import { format, subDays, subWeeks, subMonths, startOfWeek, startOfMonth } from "date-fns";

export const ProgressReports = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState<any>(null);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user, period]);

  const getDateRange = () => {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = startOfWeek(subWeeks(now, 1));
        break;
      case 'month':
        startDate = startOfMonth(subMonths(now, 1));
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      default:
        startDate = subMonths(now, 1);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    };
  };

  const fetchProgressData = async () => {
    if (!user) return;
    
    try {
      const { startDate, endDate } = getDateRange();
      
      // Fetch workout stats using the database function
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_workout_stats', {
          p_user_id: user.id,
          p_start_date: startDate,
          p_end_date: endDate
        });

      if (statsError) throw statsError;
      setStats(statsData[0] || {});

      // Fetch weight progression
      const { data: weightData, error: weightError } = await supabase
        .from('weight_logs')
        .select('weight, log_date')
        .eq('user_id', user.id)
        .gte('log_date', startDate)
        .lte('log_date', endDate)
        .order('log_date');

      if (weightError) throw weightError;

      // Group weight data by date (take average if multiple entries per day)
      const groupedWeight = weightData.reduce((acc: any, entry: any) => {
        const date = entry.log_date;
        if (!acc[date]) {
          acc[date] = { date, weights: [], count: 0 };
        }
        acc[date].weights.push(entry.weight);
        acc[date].count++;
        return acc;
      }, {});

      const weightChartData = Object.values(groupedWeight).map((group: any) => ({
        date: group.date,
        weight: group.weights.reduce((sum: number, w: number) => sum + w, 0) / group.count,
        formattedDate: format(new Date(group.date), 'MMM dd')
      }));

      setWeightData(weightChartData);

      // Fetch workout frequency data
      const { data: workoutFrequency, error: workoutError } = await supabase
        .from('workout_sessions')
        .select('workout_date, duration_minutes')
        .eq('user_id', user.id)
        .gte('workout_date', startDate)
        .lte('workout_date', endDate)
        .order('workout_date');

      if (workoutError) throw workoutError;

      // Group by week for workout frequency
      const weeklyWorkouts = workoutFrequency.reduce((acc: any, workout: any) => {
        const week = format(startOfWeek(new Date(workout.workout_date)), 'MMM dd');
        if (!acc[week]) {
          acc[week] = { week, count: 0, totalDuration: 0 };
        }
        acc[week].count++;
        acc[week].totalDuration += workout.duration_minutes || 0;
        return acc;
      }, {});

      setWorkoutData(Object.values(weeklyWorkouts));

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading progress data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Reports
            </CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">1 Week</SelectItem>
                <SelectItem value="month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.total_workouts || 0}</div>
              <div className="text-sm text-muted-foreground">Total Workouts</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.total_gym_days || 0}</div>
              <div className="text-sm text-muted-foreground">Gym Days</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats?.weight_change ? (stats.weight_change > 0 ? '+' : '') + Number(stats.weight_change).toFixed(1) + 'kg' : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Weight Change</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats?.avg_workout_duration ? Math.round(stats.avg_workout_duration) + 'min' : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {weightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {workoutData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workout Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

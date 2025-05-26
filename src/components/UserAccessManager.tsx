
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX, FileText, Shield, AlertCircle, Users } from "lucide-react";

interface UserAccess {
  id: string;
  user_id: string;
  has_site_access: boolean;
  google_docs_file_id: string | null;
  access_granted_at: string;
  access_revoked_at: string | null;
  user_email?: string;
  user_name?: string;
}

const UserAccessManager = () => {
  const [users, setUsers] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleDocsFileId, setGoogleDocsFileId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('Loading users for admin dashboard...');
      
      // Get all subscribers first (these are the users)
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('user_id, email')
        .not('user_id', 'is', null);

      if (subscribersError) {
        console.error('Error loading subscribers:', subscribersError);
        throw subscribersError;
      }

      console.log('Subscribers loaded:', subscribersData?.length || 0);

      if (!subscribersData || subscribersData.length === 0) {
        console.log('No subscribers found');
        setUsers([]);
        setLoading(false);
        return;
      }

      // Get user profiles for names
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('user_id, name');

      // Get existing access control records
      const { data: accessData } = await supabase
        .from('user_access_control')
        .select('*');

      // Combine the data
      const combinedUsers = subscribersData.map(subscriber => {
        const profile = profilesData?.find(p => p.user_id === subscriber.user_id);
        const accessControl = accessData?.find(a => a.user_id === subscriber.user_id);
        
        return {
          id: accessControl?.id || crypto.randomUUID(),
          user_id: subscriber.user_id,
          user_email: subscriber.email,
          user_name: profile?.name || 'Unknown User',
          has_site_access: accessControl?.has_site_access ?? true,
          google_docs_file_id: accessControl?.google_docs_file_id || null,
          access_granted_at: accessControl?.access_granted_at || new Date().toISOString(),
          access_revoked_at: accessControl?.access_revoked_at || null
        };
      });

      console.log('Combined users:', combinedUsers);
      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserAccess = async (userId: string, currentAccess: boolean) => {
    try {
      const { error } = await supabase
        .from('user_access_control')
        .upsert({
          user_id: userId,
          has_site_access: !currentAccess,
          access_revoked_at: !currentAccess ? null : new Date().toISOString(),
          google_docs_file_id: googleDocsFileId || null
        });

      if (error) throw error;

      toast({
        title: "Access Updated",
        description: `User access ${!currentAccess ? 'granted' : 'revoked'} successfully`,
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating user access:', error);
      toast({
        title: "Error",
        description: "Failed to update user access",
        variant: "destructive"
      });
    }
  };

  const updateGoogleDocsFile = async (userId: string) => {
    if (!googleDocsFileId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Docs file ID",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_access_control')
        .upsert({
          user_id: userId,
          google_docs_file_id: googleDocsFileId.trim()
        });

      if (error) throw error;

      toast({
        title: "Google Docs Updated",
        description: "Google Docs file ID updated successfully",
      });

      setGoogleDocsFileId('');
      loadUsers();
    } catch (error) {
      console.error('Error updating Google Docs file:', error);
      toast({
        title: "Error",
        description: "Failed to update Google Docs file",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Google Docs Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="google-docs-id">Google Docs File ID</Label>
              <Input
                id="google-docs-id"
                placeholder="Enter Google Docs file ID for member data"
                value={googleDocsFileId}
                onChange={(e) => setGoogleDocsFileId(e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This file ID will be associated with gym member data for access control.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Access Management ({users.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found in the system.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Users will appear here once they sign up for the service.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Access Status</TableHead>
                    <TableHead>Google Docs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.user_name}</TableCell>
                      <TableCell className="min-w-[200px]">{user.user_email}</TableCell>
                      <TableCell>
                        <Badge variant={user.has_site_access ? "default" : "destructive"}>
                          {user.has_site_access ? (
                            <UserCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <UserX className="h-3 w-3 mr-1" />
                          )}
                          {user.has_site_access ? 'Active' : 'Revoked'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.google_docs_file_id ? (
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Linked
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No File
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={user.has_site_access ? "destructive" : "default"}
                            onClick={() => toggleUserAccess(user.user_id, user.has_site_access)}
                          >
                            {user.has_site_access ? 'Revoke' : 'Grant'} Access
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateGoogleDocsFile(user.user_id)}
                            disabled={!googleDocsFileId.trim()}
                          >
                            Link Docs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { UserAccessManager };

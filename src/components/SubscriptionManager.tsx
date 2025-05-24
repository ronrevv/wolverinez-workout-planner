
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Calendar, AlertTriangle, Check } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export const SubscriptionManager = () => {
  const { user, subscription, refreshSubscription } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user]);

  const getDaysUntilExpiry = (date: string) => {
    return differenceInDays(new Date(date), new Date());
  };

  const isExpiringSoon = (date: string) => {
    return getDaysUntilExpiry(date) <= 7;
  };

  const handleRefreshSubscription = async () => {
    setLoading(true);
    await refreshSubscription();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Plan:</span>
                <Badge variant={subscription.subscribed ? "default" : "secondary"}>
                  {subscription.subscription_tier || (subscription.subscribed ? "Active" : "Free")}
                </Badge>
              </div>
              
              {subscription.subscription_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Subscription Ends:</span>
                  <div className="text-right">
                    <div>{format(new Date(subscription.subscription_end), 'PPP')}</div>
                    {isExpiringSoon(subscription.subscription_end) && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Expires in {getDaysUntilExpiry(subscription.subscription_end)} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {subscription.gym_membership_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gym Membership Ends:</span>
                  <div className="text-right">
                    <div>{format(new Date(subscription.gym_membership_end), 'PPP')}</div>
                    {isExpiringSoon(subscription.gym_membership_end) && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Expires in {getDaysUntilExpiry(subscription.gym_membership_end)} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  {subscription.subscribed ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Active</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Inactive</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No subscription information found.</p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleRefreshSubscription} disabled={loading} variant="outline">
              {loading ? "Refreshing..." : "Refresh Status"}
            </Button>
            {!subscription?.subscribed && (
              <Button asChild>
                <a href="/membership">Upgrade Plan</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Free Plan</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Basic workout tracking</li>
                <li>• BMI calculator</li>
                <li>• Limited workout plans</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Premium Plan</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Advanced progress tracking</li>
                <li>• Unlimited workout plans</li>
                <li>• Detailed analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

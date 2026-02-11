import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsAdmin } from '../hooks/useCurrentUser';
import { useGetAllUsers, useSetUserTier } from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { SubscriptionTier } from '../backend';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: users } = useGetAllUsers();
  const setUserTier = useSetUserTier();

  if (adminLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleTierChange = async (userId: string, tier: SubscriptionTier) => {
    try {
      await setUserTier.mutateAsync({ userId: userId as any, tier });
      toast.success('User tier updated');
    } catch (error) {
      toast.error('Failed to update tier');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, exercises, plans, and challenges.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {users?.map((user) => (
            <Card key={user.userId.toString()}>
              <CardHeader>
                <CardTitle className="text-base">
                  {user.userId.toString().slice(0, 20)}...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Experience:</span> {user.experienceLevel}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Sport:</span> {user.sportFocus}
                    </p>
                    <Badge variant={user.subscriptionTier === 'free' ? 'outline' : 'default'}>
                      {user.subscriptionTier}
                    </Badge>
                  </div>
                  <Select
                    value={user.subscriptionTier}
                    onValueChange={(v) => handleTierChange(user.userId.toString(), v as SubscriptionTier)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="annualPro">Annual Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Exercise CRUD operations will be available when backend support is added.
              </p>
              <Button disabled>Add Exercise</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Plan Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Plan CRUD operations will be available when backend support is added.
              </p>
              <Button disabled>Add Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Challenge CRUD operations will be available when backend support is added.
              </p>
              <Button disabled>Add Challenge</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

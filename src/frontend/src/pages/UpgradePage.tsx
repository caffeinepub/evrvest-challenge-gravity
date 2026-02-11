import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useUpgradeToPro } from '../hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { SubscriptionTier } from '../backend';

export default function UpgradePage() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const upgradeToPro = useUpgradeToPro();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.pro);
  const [discountCode, setDiscountCode] = useState('');

  const handleUpgrade = async () => {
    try {
      await upgradeToPro.mutateAsync({
        tier: selectedTier,
        discountCode: discountCode || undefined
      });
      toast.success('Subscription upgraded!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Upgrade failed');
    }
  };

  const isPro = profile?.subscriptionTier === SubscriptionTier.pro || profile?.subscriptionTier === SubscriptionTier.annualPro;

  if (isPro) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pb-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>You're already Pro</CardTitle>
            <CardDescription>
              You have access to all premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = [
    'Full HYROX training plans',
    'GravityAI coach chat',
    'Advanced dashboard analytics',
    'Unlimited workout templates',
    'RPE-based load adjustments',
    'Priority support'
  ];

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Upgrade to Pro</h1>
        <p className="text-muted-foreground">Unlock the full EVRVEST experience.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer transition-all ${
            selectedTier === SubscriptionTier.pro ? 'border-[oklch(0.488_0.243_264.376)] ring-2 ring-[oklch(0.488_0.243_264.376)]' : ''
          }`}
          onClick={() => setSelectedTier(SubscriptionTier.pro)}
        >
          <CardHeader>
            <CardTitle>Monthly Pro</CardTitle>
            <CardDescription>Flexible monthly subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">€5</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[oklch(0.488_0.243_264.376)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            selectedTier === SubscriptionTier.annualPro ? 'border-[oklch(0.488_0.243_264.376)] ring-2 ring-[oklch(0.488_0.243_264.376)]' : ''
          }`}
          onClick={() => setSelectedTier(SubscriptionTier.annualPro)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Annual Pro</CardTitle>
                <CardDescription>Best value + shop discount</CardDescription>
              </div>
              <Badge className="bg-[oklch(0.488_0.243_264.376)]">Save 18%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-4xl font-bold">€49</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-[oklch(0.488_0.243_264.376)]" />
                  {feature}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm font-bold text-[oklch(0.488_0.243_264.376)]">
                <Check className="h-4 w-4" />
                10% shop discount
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discount Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="discount">Have a discount code?</Label>
          <Input
            id="discount"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleUpgrade}
        disabled={upgradeToPro.isPending}
        className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)] text-lg py-6"
      >
        {upgradeToPro.isPending ? 'Processing...' : `Upgrade to ${selectedTier === SubscriptionTier.pro ? 'Monthly' : 'Annual'} Pro`}
      </Button>
    </div>
  );
}

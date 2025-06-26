import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Crown, Star } from "lucide-react";
import AuthService from "@/services/auth.service";
import SubscriptionService from "@/services/subscription.service";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  savings?: string;
}

interface Subscription {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stripeSubscriptionId?: string;
}

const Subscriptions = () => {
  const user = AuthService.getCurrentUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasSubscription: boolean;
    subscription: Subscription | null;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        SubscriptionService.getAvailablePlans(),
        SubscriptionService.getUserSubscription(),
      ]);

      setPlans(plansData.plans);
      setSubscriptionStatus(subscriptionData);
      setCurrentSubscription(subscriptionData.subscription);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      setPurchaseLoading(planId);
      const response = await SubscriptionService.createCheckoutSession(planId);

      if (response.success && response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to create checkout session. Please try again.");
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      await SubscriptionService.cancelSubscription();
      alert("Subscription cancelled successfully");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Subscription Plans
        </h1>
        <p className="text-gray-600">
          Choose the perfect plan for your affirmation journey
        </p>
      </div>

      {/* Current Subscription Status */}
      {subscriptionStatus?.hasSubscription && currentSubscription && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-green-600" />
              Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-semibold capitalize">
                  {currentSubscription.plan}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold">
                  {formatDate(currentSubscription.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold">
                  {formatDate(currentSubscription.endDate)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge
                variant={currentSubscription.isActive ? "default" : "secondary"}
              >
                {currentSubscription.isActive ? "Active" : "Inactive"}
              </Badge>
              {currentSubscription.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelSubscription}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            {plan.savings && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white">
                  {plan.savings}
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plan.id === "yearly" && (
                  <Star className="h-5 w-5 text-yellow-500" />
                )}
                {plan.name}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-500">/{plan.interval}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.id === "yearly" ? "default" : "outline"}
                onClick={() => handlePurchase(plan.id)}
                disabled={
                  purchaseLoading === plan.id ||
                  (subscriptionStatus?.hasSubscription &&
                    currentSubscription?.isActive)
                }
              >
                {purchaseLoading === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : subscriptionStatus?.hasSubscription &&
                  currentSubscription?.isActive ? (
                  "Already Subscribed"
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Mode Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800">Test Mode</h3>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          This is a test environment. Use Stripe test card numbers for testing:
        </p>
        <div className="mt-2 text-xs text-yellow-600 space-y-1">
          <p>• Success: 4242 4242 4242 4242</p>
          <p>• Decline: 4000 0000 0000 0002</p>
          <p>• Expiry: Any future date | CVC: Any 3 digits</p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;

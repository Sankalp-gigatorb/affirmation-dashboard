import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, XCircle } from "lucide-react";
import SubscriptionService from "../services/subscription.service";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<{
    success: boolean;
    message: string;
    subscription?: any;
  } | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setLoading(false);
      setVerificationStatus({
        success: false,
        message: "No session ID found",
      });
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log("Verifying payment for session:", sessionId);
      const result = await SubscriptionService.verifyPaymentSuccess(sessionId);
      console.log("Payment verification result:", result);

      // If payment is verified but subscription is not found, trigger webhook processing
      if (result.success && !result.subscription) {
        console.log(
          "Payment verified but subscription not found. Triggering webhook processing..."
        );
        try {
          const webhookResult =
            await SubscriptionService.triggerWebhookProcessing(sessionId);
          console.log("Webhook processing result:", webhookResult);

          if (webhookResult.success) {
            // Re-fetch subscription status after webhook processing
            const subscriptionResult =
              await SubscriptionService.getUserSubscription();
            setVerificationStatus({
              success: true,
              message:
                "Payment verified and subscription activated successfully",
              subscription: subscriptionResult.subscription,
            });
          } else {
            setVerificationStatus({
              success: false,
              message:
                webhookResult.message || "Failed to activate subscription",
            });
          }
        } catch (webhookError) {
          console.error("Error triggering webhook processing:", webhookError);
          setVerificationStatus({
            success: false,
            message: "Payment verified but failed to activate subscription",
          });
        }
      } else {
        setVerificationStatus(result);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setVerificationStatus({
        success: false,
        message: "Failed to verify payment",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoToSubscriptions = () => {
    navigate("/subscriptions");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus?.success ? (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Payment Successful!
              </CardTitle>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Payment Verification Failed
              </CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationStatus?.success ? (
            <>
              <p className="text-gray-600">
                Thank you for subscribing to our premium plan! Your subscription
                is now active.
              </p>

              {verificationStatus.subscription && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {verificationStatus.subscription.plan} Plan
                    </span>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <Button onClick={handleGoToDashboard} className="w-full">
                  Go to Dashboard
                </Button>
                <Button
                  onClick={handleGoToSubscriptions}
                  variant="outline"
                  className="w-full"
                >
                  View Subscription Details
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                {verificationStatus?.message ||
                  "There was an issue verifying your payment."}
              </p>

              <div className="space-y-2">
                <Button onClick={handleGoToSubscriptions} className="w-full">
                  Try Again
                </Button>
                <Button
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;

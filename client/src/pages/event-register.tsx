import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Lock, CreditCard, DollarSign, Loader2 } from "lucide-react";
import type { Event } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function PaymentForm({ onSuccess, amount, registrationId, paymentIntentId, eventId }: { onSuccess: () => void; amount: string; registrationId: string; paymentIntentId: string; eventId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/events",
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        try {
          await apiRequest("POST", `/api/events/${eventId}/confirm-registration`, {
            registrationId,
            paymentIntentId,
          });
        } catch (confirmErr) {
          console.error("Failed to confirm registration on server:", confirmErr);
        }
        onSuccess();
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-primary" />
        <span className="font-semibold">Registration Fee: ${amount}</span>
      </div>
      <PaymentElement />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Payments are secure and encrypted via Stripe</span>
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isProcessing || !stripe}
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${amount}
          </>
        )}
      </Button>
    </form>
  );
}

export default function EventRegister() {
  const [, params] = useRoute("/events/:id/register");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const eventId = params?.id;

  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Event not found");
      return res.json();
    },
    enabled: !!eventId,
  });

  const hasFee = event && event.registrationFee && parseFloat(event.registrationFee) > 0;
  const totalAmount = hasFee ? (parseFloat(event.registrationFee!) * numberOfAttendees).toFixed(2) : "0";
  const isFull = event?.maxAttendees ? (event.currentAttendees || 0) >= event.maxAttendees : false;
  const spotsLeft = event?.maxAttendees ? event.maxAttendees - (event.currentAttendees || 0) : null;

  const handleRegister = async () => {
    if (!attendeeName || !attendeeEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasFee) {
        const response = await apiRequest("POST", `/api/events/${eventId}/register`, {
          attendeeName,
          attendeeEmail,
          numberOfAttendees,
          requiresPayment: true,
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setRegistrationId(data.registration.id);
        setPaymentIntentId(data.registration.stripePaymentIntentId);
        setShowPayment(true);
      } else {
        await apiRequest("POST", `/api/events/${eventId}/register`, {
          attendeeName,
          attendeeEmail,
          numberOfAttendees,
          requiresPayment: false,
        });
        setRegistrationComplete(true);
        toast({
          title: "Registration Confirmed!",
          description: "You have been successfully registered for this event.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to process your registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setRegistrationComplete(true);
    toast({
      title: "Registration Complete!",
      description: "Your payment has been processed and you are registered for this event.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/events" data-testid="link-back-events">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold font-headings" data-testid="text-registration-success">Registration Confirmed!</h2>
            <p className="text-muted-foreground">
              You have been registered for <strong>{event.title}</strong>.
              A confirmation has been sent to <strong>{attendeeEmail}</strong>.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-left text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{numberOfAttendees} attendee{numberOfAttendees > 1 ? "s" : ""}</span>
              </div>
            </div>
            <Button asChild className="w-full" data-testid="button-back-to-events">
              <Link href="/events">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <Button variant="ghost" asChild className="mb-6" data-testid="link-back-events">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-headings">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-bold text-xl font-headings" data-testid="text-event-title">{event.title}</h3>
                {event.program && (
                  <Badge variant="secondary" data-testid="badge-program">
                    {event.program.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  {spotsLeft !== null && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</span>
                    </div>
                  )}
                  {hasFee && (
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>${event.registrationFee} per person</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground border-t pt-4">{event.description}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-headings">
                  {showPayment ? "Complete Payment" : "Registration Form"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showPayment && clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handlePaymentSuccess} amount={totalAmount} registrationId={registrationId} paymentIntentId={paymentIntentId} eventId={eventId!} />
                  </Elements>
                ) : (
                  <div className="space-y-5">
                    {isFull && (
                      <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                        This event is currently full. Registration is not available.
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        disabled={isFull}
                        data-testid="input-attendee-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={attendeeEmail}
                        onChange={(e) => setAttendeeEmail(e.target.value)}
                        disabled={isFull}
                        data-testid="input-attendee-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendees">Number of Attendees</Label>
                      <Input
                        id="attendees"
                        type="number"
                        min={1}
                        max={spotsLeft ?? 10}
                        value={numberOfAttendees}
                        onChange={(e) => setNumberOfAttendees(Math.max(1, parseInt(e.target.value) || 1))}
                        disabled={isFull}
                        data-testid="input-number-attendees"
                      />
                    </div>

                    {hasFee && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fee per person</span>
                          <span>${event.registrationFee}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Attendees</span>
                          <span>{numberOfAttendees}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold">
                          <span>Total</span>
                          <span data-testid="text-total-amount">${totalAmount}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleRegister}
                      disabled={isFull || isSubmitting}
                      data-testid="button-register-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : hasFee ? (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Continue to Payment - ${totalAmount}
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </Button>

                    {!hasFee && (
                      <p className="text-xs text-center text-muted-foreground">
                        This is a free event. No payment required.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

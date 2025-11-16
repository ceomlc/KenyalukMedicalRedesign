import { useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Heart, CheckCircle2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [
    { value: "25", impact: "Medical kit for 5 children" },
    { value: "50", impact: "Weekly clinic supplies" },
    { value: "100", impact: "Full health education workshop" },
    { value: "250", impact: "Mobile medical outreach day" },
  ];

  const handleDonateClick = async () => {
    const amount = customAmount || selectedAmount;
    if (!amount || !donorName || !donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide your name, email, and donation amount",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: numericAmount,
        donorName,
        donorEmail,
        isRecurring,
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    }
  };

  if (showPayment && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm
          amount={customAmount || selectedAmount}
          donorName={donorName}
          donorEmail={donorEmail}
          isRecurring={isRecurring}
        />
      </Elements>
    );
  }

  return (
    <div className="space-y-8">
      {/* Recurring Toggle */}
      <div className="text-center">
        <Label className="text-base mb-3 block">Donation Type</Label>
        <RadioGroup
          value={isRecurring ? "recurring" : "one-time"}
          onValueChange={(value) => setIsRecurring(value === "recurring")}
          className="flex justify-center gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-time" id="one-time" data-testid="radio-one-time" />
            <Label htmlFor="one-time" className="cursor-pointer">One-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recurring" id="recurring" data-testid="radio-recurring" />
            <Label htmlFor="recurring" className="cursor-pointer">Monthly</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Preset Amounts */}
      <div>
        <Label className="text-base mb-4 block text-center">Select Amount</Label>
        <div className="grid grid-cols-2 gap-4">
          {presetAmounts.map((preset) => (
            <Card
              key={preset.value}
              className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                selectedAmount === preset.value && !customAmount
                  ? "border-primary border-2"
                  : ""
              }`}
              onClick={() => {
                setSelectedAmount(preset.value);
                setCustomAmount("");
              }}
              data-testid={`amount-${preset.value}`}
            >
              <CardContent className="p-6 text-center">
                <div className="font-headings font-bold text-2xl md:text-3xl text-primary mb-2">
                  ${preset.value}
                </div>
                <p className="text-sm text-muted-foreground">{preset.impact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div>
        <Label htmlFor="custom-amount" className="text-base mb-2 block">
          Or Enter Custom Amount
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="custom-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            className="pl-8 h-12 text-lg"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            data-testid="input-custom-amount"
          />
        </div>
      </div>

      {/* Donor Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="donor-name">Name *</Label>
          <Input
            id="donor-name"
            placeholder="Your full name"
            className="h-12"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            data-testid="input-donor-name"
            required
          />
        </div>
        <div>
          <Label htmlFor="donor-email">Email *</Label>
          <Input
            id="donor-email"
            type="email"
            placeholder="your.email@example.com"
            className="h-12"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            data-testid="input-donor-email"
            required
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 py-4">
        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-4 w-4" />
          <span>SSL Secure</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-4 w-4" />
          <span>PCI Compliant</span>
        </Badge>
      </div>

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full text-lg font-semibold min-h-14"
        onClick={handleDonateClick}
        data-testid="button-proceed-payment"
      >
        Proceed to Payment
      </Button>
    </div>
  );
}

function PaymentForm({
  amount,
  donorName,
  donorEmail,
  isRecurring,
}: {
  amount: string;
  donorName: string;
  donorEmail: string;
  isRecurring: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donation-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your donation!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-2">
          {isRecurring ? "Monthly" : "One-time"} Donation
        </p>
        <p className="font-headings font-bold text-4xl text-primary">
          ${amount}
        </p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg font-semibold min-h-14"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-donation"
      >
        {isProcessing ? "Processing..." : "Complete Donation"}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
}

export default function Donate() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Make a Donation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Your generosity brings healthcare to communities that need it most. Every contribution makes a real difference.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <DonationForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl mb-8 text-center">
            Your Donation At Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">100% Goes to Programs</h3>
                <p className="text-sm text-muted-foreground">
                  Every dollar directly supports our healthcare initiatives
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Tax Deductible</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a receipt for your tax-deductible donation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Transparent Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Regular updates on how your donation creates change
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

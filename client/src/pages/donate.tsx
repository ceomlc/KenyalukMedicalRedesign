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
import { Shield, Heart, CheckCircle2, Lock, CreditCard, ArrowRight } from "lucide-react";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";

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
    { value: "25", impact: "Medical supplies for 5 families" },
    { value: "50", impact: "Health education workshop" },
    { value: "100", impact: "Mobile clinic day" },
    { value: "250", impact: "Full medical outreach program" },
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
      <div className="text-center space-y-4">
        <Label className="text-base font-semibold block">Choose Donation Type</Label>
        <RadioGroup
          value={isRecurring ? "recurring" : "one-time"}
          onValueChange={(value) => setIsRecurring(value === "recurring")}
          className="inline-flex gap-2 p-1 bg-muted rounded-full"
        >
          <div className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${!isRecurring ? 'bg-background shadow-sm' : ''}`}>
            <RadioGroupItem value="one-time" id="one-time" data-testid="radio-one-time" />
            <Label htmlFor="one-time" className="cursor-pointer font-medium">One-time</Label>
          </div>
          <div className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all ${isRecurring ? 'bg-background shadow-sm' : ''}`}>
            <RadioGroupItem value="recurring" id="recurring" data-testid="radio-recurring" />
            <Label htmlFor="recurring" className="cursor-pointer font-medium">Monthly</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Preset Amounts */}
      <div className="space-y-4">
        <Label className="text-base font-semibold block text-center">Select Donation Amount</Label>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {presetAmounts.map((preset, index) => (
            <Card
              key={preset.value}
              className={`cursor-pointer hover-elevate active-elevate-2 transition-all duration-300 border-2 animate-in fade-in slide-in-from-bottom-4 ${
                selectedAmount === preset.value && !customAmount
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              style={{ animationDelay: `${index * 100}ms`, animationDuration: '500ms' }}
              onClick={() => {
                setSelectedAmount(preset.value);
                setCustomAmount("");
              }}
              data-testid={`amount-${preset.value}`}
            >
              <CardContent className="p-5 md:p-6 text-center">
                <div className="font-headings font-bold text-3xl md:text-4xl bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                  ${preset.value}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{preset.impact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="space-y-3">
        <Label htmlFor="custom-amount" className="text-base font-semibold">
          Or Enter Custom Amount
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">
            $
          </span>
          <Input
            id="custom-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter your amount"
            className="pl-8 text-lg"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            data-testid="input-custom-amount"
          />
        </div>
      </div>

      {/* Donor Information */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base">Your Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="donor-name">Full Name *</Label>
            <Input
              id="donor-name"
              placeholder="John Doe"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              data-testid="input-donor-name"
              required
            />
          </div>
          <div>
            <Label htmlFor="donor-email">Email Address *</Label>
            <Input
              id="donor-email"
              type="email"
              placeholder="john@example.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              data-testid="input-donor-email"
              required
            />
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="font-medium">SSL Secure</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-medium">PCI Compliant</span>
          </Badge>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <SiVisa className="h-8 w-auto" />
          <SiMastercard className="h-8 w-auto" />
          <SiAmericanexpress className="h-8 w-auto" />
          <CreditCard className="h-6 w-6" />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full font-semibold group/btn"
        onClick={handleDonateClick}
        data-testid="button-proceed-payment"
      >
        Proceed to Secure Payment
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        Your payment information is encrypted and secure
      </p>
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
      <div className="text-center py-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">
          {isRecurring ? "Monthly" : "One-time"} Donation
        </p>
        <p className="font-headings font-bold text-5xl md:text-6xl bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
          ${amount}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          to {donorName}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Payment Details</Label>
        <PaymentElement />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full font-semibold"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-donation"
      >
        {isProcessing ? (
          <>
            <span className="animate-pulse">Processing Payment...</span>
          </>
        ) : (
          <>
            <Heart className="mr-2 h-5 w-5" />
            Complete Donation
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <Shield className="h-4 w-4 text-green-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
}

export default function Donate() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb,0,0,0),0.15),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          
          <Badge className="mb-6" variant="outline" data-testid="badge-donate">
            Make an Impact Today
          </Badge>
          
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight">
            Transform Lives Through
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Generosity
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Every contribution brings healthcare to communities that need it most. Your donation creates lasting change.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold">Choose Your Impact</CardTitle>
              <p className="text-muted-foreground mt-2">Select an amount or enter a custom donation</p>
            </CardHeader>
            <CardContent className="p-6 md:p-8 lg:p-10">
              <DonationForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-headings font-bold text-4xl md:text-5xl mb-4 tracking-tight">
              Your Donation At Work
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              See exactly how your contribution makes a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: CheckCircle2,
                title: "100% Goes to Programs",
                description: "Every dollar directly supports our healthcare initiatives",
                color: "text-green-600 dark:text-green-400"
              },
              {
                icon: Shield,
                title: "Tax Deductible",
                description: "Receive a receipt for your tax-deductible donation",
                color: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: Heart,
                title: "Transparent Impact",
                description: "Regular updates on how your donation creates change",
                color: "text-pink-600 dark:text-pink-400"
              }
            ].map((item, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationDuration: '700ms' }}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-muted to-background mb-4">
                    <item.icon className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <h3 className="font-headings font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

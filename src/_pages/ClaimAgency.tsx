"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Building2, Mail, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAgencies } from "@/hooks/useAgencies";
import { Header } from "@/components/layout/Header";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const steps = [
  { id: 1, title: "Select Agency", icon: Building2 },
  { id: 2, title: "Verify Ownership", icon: Shield },
];

export default function ClaimAgency() {
  const [searchParams] = useSearchParams();
  const preselectedAgencyId = searchParams.get("agency");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAgencyId, setSelectedAgencyId] = useState(preselectedAgencyId || "");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [verificationInput, setVerificationInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Fetch unclaimed agencies
  const { data: agencies, isLoading: agenciesLoading } = useAgencies();
  const unclaimedAgencies = agencies?.filter(a => a.claim_status !== 'claimed') || [];

  const selectedAgency = agencies?.find(a => a.id === selectedAgencyId);

  useEffect(() => {
    if (preselectedAgencyId && agencies) {
      const agency = agencies.find(a => a.id === preselectedAgencyId);
      if (agency) {
        setSelectedAgencyId(preselectedAgencyId);
      }
    }
  }, [preselectedAgencyId, agencies]);

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const sendOtp = async () => {
    if (!verificationInput) {
      toast({
        title: "Verification required",
        description: `Please enter a valid ${verificationMethod === "email" ? "email address" : "phone number"}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In production, this would send an actual OTP via email or SMS
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOtpSent(true);
      toast({
        title: "Verification code sent",
        description: `We've sent a 6-digit code to ${verificationInput}`,
      });
    } catch (error) {
      toast({
        title: "Failed to send code",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyAndClaim = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // For demo: accept any 6-digit OTP
      // In production, verify against stored OTP

      // Get or create user session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Create a user account with the verified email/phone
        const password = Math.random().toString(36).slice(-12);
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: verificationMethod === "email" ? verificationInput : `${verificationInput.replace(/\D/g, '')}@phone.placeholder`,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Update the agency to mark it as claimed
          const { error: claimError } = await supabase
            .from('agencies')
            .update({
              claim_status: 'claimed',
              claimed_at: new Date().toISOString(),
              user_id: authData.user.id,
            })
            .eq('id', selectedAgencyId);

          if (claimError) throw claimError;
        }
      } else {
        // User already logged in, update the agency to mark it as claimed
        const { error: claimError } = await supabase
          .from('agencies')
          .update({
            claim_status: 'claimed',
            claimed_at: new Date().toISOString(),
            user_id: user.id,
          })
          .eq('id', selectedAgencyId);

        if (claimError) throw claimError;
      }

      setIsComplete(true);
      toast({
        title: "Agency claimed successfully!",
        description: "You now have control over your agency profile.",
      });
    } catch (error: any) {
      console.error("Error claiming agency:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background-warm">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-2xl mx-auto overflow-hidden">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">Agency Claimed Successfully!</h3>
              <p className="text-muted-foreground mb-6">
                You now have full control over your agency profile. Update your information and start connecting with potential foster carers.
              </p>
              <Button asChild>
                <Link href="/agency/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Claim Your Agency</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              If your agency is already listed on our directory, verify your ownership to manage your profile.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Not listed yet? <Link href="/register-agency" className="text-primary hover:underline">Register your agency</Link>
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Progress Steps */}
              <div className="bg-background-warm p-4 border-b border-border">
                <div className="flex items-center justify-center gap-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep >= step.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                </p>
              </div>

              {/* Form Steps */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">Select Your Agency</h3>

                      {agenciesLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Loading agencies...
                        </div>
                      ) : unclaimedAgencies.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            No unclaimed agencies found. Would you like to register your agency instead?
                          </p>
                          <Button asChild>
                            <Link href="/register-agency">Register Your Agency</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Label>Choose your agency from the list</Label>
                          <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select an agency..." />
                            </SelectTrigger>
                            <SelectContent>
                              {unclaimedAgencies.map((agency) => (
                                <SelectItem key={agency.id} value={agency.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{agency.name}</span>
                                    {agency.city && (
                                      <span className="text-xs text-muted-foreground">{agency.city}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {selectedAgency && (
                            <Card className="bg-muted/50">
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-2">{selectedAgency.name}</h4>
                                {selectedAgency.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {selectedAgency.description}
                                  </p>
                                )}
                                {selectedAgency.city && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    📍 {selectedAgency.city}{selectedAgency.postcode && `, ${selectedAgency.postcode}`}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">Verify Your Ownership</h3>

                      <p className="text-sm text-muted-foreground">
                        To prove you own or represent <strong>{selectedAgency?.name}</strong>, please verify using your agency's official contact details.
                      </p>

                      {!otpSent ? (
                        <>
                          <div className="space-y-4">
                            <Label>Choose verification method</Label>
                            <RadioGroup
                              value={verificationMethod}
                              onValueChange={(value) => setVerificationMethod(value as "email" | "phone")}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                                <RadioGroupItem value="email" id="verify-email" />
                                <Label htmlFor="verify-email" className="cursor-pointer flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Business Email
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                                <RadioGroupItem value="phone" id="verify-phone" />
                                <Label htmlFor="verify-phone" className="cursor-pointer flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  Phone Number
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="verificationInput">
                              {verificationMethod === "email" ? "Business Email Address" : "Phone Number"}
                            </Label>
                            <Input
                              id="verificationInput"
                              type={verificationMethod === "email" ? "email" : "tel"}
                              value={verificationInput}
                              onChange={(e) => setVerificationInput(e.target.value)}
                              placeholder={verificationMethod === "email" ? "contact@youragency.com" : "01234 567890"}
                            />
                            <p className="text-xs text-muted-foreground">
                              {verificationMethod === "email"
                                ? "Enter your agency's official business email from your website"
                                : "Enter the phone number listed on your agency's profile or website"
                              }
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                              We've sent a 6-digit verification code to <strong>{verificationInput}</strong>
                            </p>

                            <div className="flex justify-center mb-4">
                              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>

                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                setOtpSent(false);
                                setOtp("");
                              }}
                            >
                              Didn't receive the code? Try again
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? "invisible" : ""}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep === 1 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!selectedAgencyId}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : !otpSent ? (
                    <Button
                      onClick={sendOtp}
                      disabled={isSubmitting || !verificationInput}
                    >
                      {isSubmitting ? "Sending..." : "Send Verification Code"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={verifyAndClaim}
                      disabled={isSubmitting || otp.length !== 6}
                    >
                      {isSubmitting ? "Verifying..." : "Verify & Claim Agency"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
}

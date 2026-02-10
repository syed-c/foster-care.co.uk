"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Building2, User, MapPin, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface FormData {
  agencyName: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  website: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  agencyName: "",
  slug: "",
  description: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  website: "",
  password: "",
  confirmPassword: "",
};

const steps = [
  { id: 1, title: "Agency Details", icon: Building2 },
  { id: 2, title: "Contact Information", icon: User },
  { id: 3, title: "Location & Website", icon: MapPin },
  { id: 4, title: "Account Setup", icon: Key },
];

export default function RegisterAgency() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'agencyName') {
      const generatedSlug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.agencyName.trim() !== "" && formData.slug.trim() !== "" && formData.description.trim() !== "";
      case 2:
        return formData.email.trim() !== "" && formData.phone.trim() !== "";
      case 3:
        return formData.address.trim() !== "" && formData.city.trim() !== "" && formData.postcode.trim() !== "";
      case 4:
        return formData.password.length >= 6 && formData.password === formData.confirmPassword;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Validation Error",
        description: "Please ensure all fields are filled correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingAgency } = await supabase
        .from("agencies")
        .select("id")
        .eq("slug", formData.slug)
        .single();

      if (existingAgency) {
        toast({
          title: "Agency already exists",
          description: "An agency with this slug already exists. Please choose a different name.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!user) {
        // Sign up the user if they're not already logged in
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.agencyName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (authError) throw authError;
        
        if (!authData.user?.id) {
          throw new Error("Failed to create user account");
        }
      }

      // Create the agency directly
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: formData.agencyName,
          slug: formData.slug,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          website: formData.website,
          is_claimed: true,
          is_verified: false,
        })
        .select()
        .single();

      if (agencyError) throw agencyError;

      setIsComplete(true);
      toast({
        title: "Agency registered successfully!",
        description: "Your agency profile has been created. An administrator will review it shortly.",
      });
    } catch (error: any) {
      console.error("Error registering agency:", error);
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
              <h3 className="text-2xl font-semibold mb-2">Agency Registered Successfully!</h3>
              <p className="text-muted-foreground mb-6">
                Your agency profile has been created. An administrator will review it and verify your agency shortly.
              </p>
              <Button asChild>
                <Link href="/agency/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Register Your Agency</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Add your fostering agency to our directory and connect with potential foster carers in your area.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Already listed? <Link href="/claim" className="text-primary hover:underline">Claim your agency</Link>
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Progress Steps */}
              <div className="bg-background-warm p-4 border-b border-border">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          currentStep >= step.id
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
                          className={`w-8 sm:w-12 h-0.5 transition-colors ${
                            currentStep > step.id ? "bg-primary" : "bg-muted"
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
                      <h3 className="text-xl font-semibold mb-4">Agency Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="agencyName">Agency Name *</Label>
                          <Input
                            id="agencyName"
                            value={formData.agencyName}
                            onChange={(e) => updateFormData("agencyName", e.target.value)}
                            placeholder="Enter agency name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug">Agency URL Slug *</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => updateFormData("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                            placeholder="agency-name"
                            disabled={formData.agencyName !== ""}
                          />
                          <p className="text-xs text-muted-foreground">
                            This will be used in your agency's URL (e.g., /agencies/{formData.slug || 'your-agency'})
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description *</Label>
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            placeholder="Describe your agency and the services you provide"
                            className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            rows={4}
                          />
                        </div>
                      </div>
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
                      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              placeholder="contact@agency.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              placeholder="01234 567890"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">Location & Website</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => updateFormData("city", e.target.value)}
                              placeholder="London"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postcode">Postcode *</Label>
                            <Input
                              id="postcode"
                              value={formData.postcode}
                              onChange={(e) => updateFormData("postcode", e.target.value)}
                              placeholder="SW1A 1AA"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website URL</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => updateFormData("website", e.target.value)}
                            placeholder="https://www.agency.com"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">Account Setup</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateFormData("password", e.target.value)}
                            placeholder="At least 6 characters"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                            placeholder="Re-enter your password"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          By submitting this form, you agree to our terms of service and privacy policy.
                        </p>
                      </div>
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
                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Register Agency"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

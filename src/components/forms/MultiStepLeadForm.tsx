import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Home, Users, Baby, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  accommodationType: string;
  hasChildren: boolean | null;
  hasPets: boolean | null;
  fosteringInterest: string;
  preferredAgeGroup: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postcode: "",
  accommodationType: "",
  hasChildren: null,
  hasPets: null,
  fosteringInterest: "",
  preferredAgeGroup: "",
  message: "",
};

const steps = [
  { id: 1, title: "Your Details", icon: Users },
  { id: 2, title: "Your Home", icon: Home },
  { id: 3, title: "Fostering Preferences", icon: Baby },
  { id: 4, title: "Additional Info", icon: MessageSquare },
];

interface MultiStepLeadFormProps {
  sourceType?: string;
  sourceAgencyId?: string;
  sourceLocationId?: string;
  onSuccess?: () => void;
}

export function MultiStepLeadForm({ 
  sourceType = "website", 
  sourceAgencyId, 
  sourceLocationId,
  onSuccess 
}: MultiStepLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: keyof FormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        postcode: formData.postcode || null,
        accommodation_type: formData.accommodationType || null,
        has_children: formData.hasChildren,
        has_pets: formData.hasPets,
        fostering_interest: formData.fosteringInterest || null,
        preferred_age_group: formData.preferredAgeGroup || null,
        message: formData.message || null,
        source_type: sourceType,
        source_agency_id: sourceAgencyId || null,
        source_location_id: sourceLocationId || null,
      });

      if (error) throw error;

      setIsComplete(true);
      toast({
        title: "Thank you for your enquiry!",
        description: "We'll be in touch within 24 hours.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Your enquiry has been received. A fostering advisor will contact you within 24 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Progress Steps */}
        <div className="bg-background-warm p-4 border-b border-border">
          <div className="flex items-center justify-between max-w-md mx-auto">
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
            Step {currentStep} of 4: {steps[currentStep - 1].title}
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
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4">Tell us about yourself</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="07XXX XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={formData.postcode}
                      onChange={(e) => updateFormData("postcode", e.target.value)}
                      placeholder="SW1A 1AA"
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
                <h3 className="text-xl font-semibold mb-4">About your home</h3>
                <div className="space-y-3">
                  <Label>Type of accommodation</Label>
                  <RadioGroup
                    value={formData.accommodationType}
                    onValueChange={(value) => updateFormData("accommodationType", value)}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {["House", "Flat/Apartment", "Bungalow", "Other"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={type.toLowerCase()} id={type} />
                        <Label htmlFor={type} className="cursor-pointer flex-1">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have children living at home?</Label>
                  <RadioGroup
                    value={formData.hasChildren === null ? "" : formData.hasChildren.toString()}
                    onValueChange={(value) => updateFormData("hasChildren", value === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="hasChildren-yes" />
                      <Label htmlFor="hasChildren-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="false" id="hasChildren-no" />
                      <Label htmlFor="hasChildren-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have pets?</Label>
                  <RadioGroup
                    value={formData.hasPets === null ? "" : formData.hasPets.toString()}
                    onValueChange={(value) => updateFormData("hasPets", value === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="hasPets-yes" />
                      <Label htmlFor="hasPets-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="false" id="hasPets-no" />
                      <Label htmlFor="hasPets-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
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
                <h3 className="text-xl font-semibold mb-4">Fostering preferences</h3>
                <div className="space-y-3">
                  <Label>What type of fostering interests you?</Label>
                  <RadioGroup
                    value={formData.fosteringInterest}
                    onValueChange={(value) => updateFormData("fosteringInterest", value)}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {[
                      "Short-term fostering",
                      "Long-term fostering",
                      "Respite care",
                      "Emergency placements",
                      "Not sure yet",
                    ].map((type) => (
                      <div
                        key={type}
                        className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={type.toLowerCase().replace(/\s+/g, "-")} id={type} />
                        <Label htmlFor={type} className="cursor-pointer flex-1">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Preferred age group to foster</Label>
                  <RadioGroup
                    value={formData.preferredAgeGroup}
                    onValueChange={(value) => updateFormData("preferredAgeGroup", value)}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {[
                      "0-4 years (babies/toddlers)",
                      "5-10 years (primary age)",
                      "11-15 years (secondary age)",
                      "16+ years (young adults)",
                      "Any age",
                    ].map((age) => (
                      <div
                        key={age}
                        className="flex items-center space-x-3 p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={age.split(" ")[0].toLowerCase()} id={age} />
                        <Label htmlFor={age} className="cursor-pointer flex-1 text-sm">
                          {age}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-4">Anything else?</h3>
                <div className="space-y-2">
                  <Label htmlFor="message">Additional information or questions</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => updateFormData("message", e.target.value)}
                    placeholder="Tell us anything else you'd like us to know, or ask any questions you have about fostering..."
                    rows={5}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you agree to be contacted by a fostering advisor to discuss your enquiry.
                </p>
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
                disabled={
                  (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email))
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Home, 
  Users, 
  Baby, 
  MessageSquare,
  Clock,
  Briefcase,
  Heart,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Step 1: Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  bestContactTime: string;
  
  // Step 2: Your Situation
  accommodationType: string;
  hasSpareRoom: boolean | null;
  hasOwnChildren: boolean | null;
  hasPets: boolean | null;
  
  // Step 3: Fostering Interest
  fosteringType: string;
  preferredAgeGroups: string[];
  willingSiblings: boolean | null;
  
  // Step 4: Experience & Timeframe
  experienceLevel: string;
  timeframe: string;
  
  // Step 5: Additional
  specialConsiderations: string;
  locationPreference: string;
  marketingConsent: boolean;
  privacyAccepted: boolean;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postcode: "",
  bestContactTime: "",
  accommodationType: "",
  hasSpareRoom: null,
  hasOwnChildren: null,
  hasPets: null,
  fosteringType: "",
  preferredAgeGroups: [],
  willingSiblings: null,
  experienceLevel: "",
  timeframe: "",
  specialConsiderations: "",
  locationPreference: "",
  marketingConsent: false,
  privacyAccepted: false,
};

const steps = [
  { id: 1, title: "Your Details", icon: Users, description: "Basic contact information" },
  { id: 2, title: "Your Home", icon: Home, description: "About your living situation" },
  { id: 3, title: "Fostering Type", icon: Baby, description: "What fostering interests you" },
  { id: 4, title: "Experience", icon: Briefcase, description: "Your background & timeline" },
  { id: 5, title: "Final Steps", icon: Heart, description: "Anything else we should know" },
];

interface LeadQualificationFormProps {
  sourceType?: string;
  sourceAgencyId?: string;
  sourceLocationId?: string;
  onSuccess?: () => void;
}

export function LeadQualificationForm({ 
  sourceType = "website", 
  sourceAgencyId, 
  sourceLocationId,
  onSuccess 
}: LeadQualificationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const progress = (currentStep / steps.length) * 100;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAgeGroup = (age: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredAgeGroups: prev.preferredAgeGroups.includes(age)
        ? prev.preferredAgeGroups.filter((a) => a !== age)
        : [...prev.preferredAgeGroups, age],
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const calculateQualificationScore = (): number => {
    let score = 0;
    if (formData.hasSpareRoom) score += 20;
    if (formData.experienceLevel === "experienced") score += 15;
    if (formData.experienceLevel === "some") score += 10;
    if (formData.timeframe === "immediately" || formData.timeframe === "1-3-months") score += 15;
    if (formData.fosteringType) score += 10;
    if (formData.preferredAgeGroups.length > 0) score += 10;
    if (formData.postcode) score += 10;
    if (formData.phone) score += 10;
    if (formData.willingSiblings) score += 10;
    return Math.min(score, 100);
  };

  const calculateIntentDepth = (): string => {
    const score = calculateQualificationScore();
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  };

  const handleSubmit = async () => {
    if (!formData.privacyAccepted) {
      toast({
        title: "Please accept the privacy policy",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert lead
      const leadData = {
        first_name: formData.firstName,
        last_name: formData.lastName || null,
        email: formData.email,
        phone: formData.phone || null,
        postcode: formData.postcode || null,
        preferred_contact: formData.bestContactTime || null,
        fostering_interest: formData.fosteringType ? [formData.fosteringType] : null,
        message: formData.specialConsiderations || null,
        source_page: sourceType,
        source_agency_id: sourceAgencyId || null,
        source_location_id: sourceLocationId || null,
        marketing_consent: formData.marketingConsent,
        privacy_accepted: formData.privacyAccepted,
        intent_depth: calculateIntentDepth(),
        qualification_complete: true,
      };

      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert(leadData)
        .select()
        .single();

      if (leadError) throw leadError;

      // Insert qualification data
      const qualificationData = {
        lead_id: lead.id,
        accommodation_type: formData.accommodationType || null,
        has_spare_room: formData.hasSpareRoom,
        has_own_children: formData.hasOwnChildren,
        has_pets: formData.hasPets,
        fostering_type: formData.fosteringType || null,
        preferred_age_groups: formData.preferredAgeGroups.length > 0 ? formData.preferredAgeGroups : null,
        willing_siblings: formData.willingSiblings,
        experience_level: formData.experienceLevel || null,
        timeframe: formData.timeframe || null,
        special_considerations: formData.specialConsiderations || null,
        location_preference: formData.locationPreference || null,
        best_contact_time: formData.bestContactTime || null,
        qualification_score: calculateQualificationScore(),
        steps_completed: 5,
        completion_percentage: 100,
      };

      await supabase.from("lead_qualifications").insert(qualificationData);

      setIsComplete(true);
      toast({
        title: "Thank you for your enquiry!",
        description: "We'll be in touch within 24 hours to discuss your fostering journey.",
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
      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-verified/10 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-verified" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your enquiry has been received. A fostering advisor will contact you within 24 hours 
            to help you take the next step in your fostering journey.
          </p>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm">
            <p className="text-muted-foreground">
              <strong>What happens next?</strong><br />
              To help match you with the best agency for your needs, you may receive a short 
              follow-up email with a few more questions. This is entirely optional.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-primary/5 to-warm/5 p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">{steps[currentStep - 1].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
            <span className="text-sm font-medium text-primary">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
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
                <div className="space-y-2">
                  <Label>Best time to contact you</Label>
                  <RadioGroup
                    value={formData.bestContactTime}
                    onValueChange={(value) => updateFormData("bestContactTime", value)}
                    className="grid sm:grid-cols-3 gap-3"
                  >
                    {["Morning", "Afternoon", "Evening"].map((time) => (
                      <div
                        key={time}
                        className="flex items-center space-x-3 p-3 rounded-xl border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={time.toLowerCase()} id={`time-${time}`} />
                        <Label htmlFor={`time-${time}`} className="cursor-pointer">{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 2: Your Home */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                        className="flex items-center space-x-3 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={type.toLowerCase()} id={type} />
                        <Label htmlFor={type} className="cursor-pointer flex-1">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have a spare bedroom?</Label>
                  <RadioGroup
                    value={formData.hasSpareRoom === null ? "" : formData.hasSpareRoom.toString()}
                    onValueChange={(value) => updateFormData("hasSpareRoom", value === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="hasSpareRoom-yes" />
                      <Label htmlFor="hasSpareRoom-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="false" id="hasSpareRoom-no" />
                      <Label htmlFor="hasSpareRoom-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Do you have children living at home?</Label>
                  <RadioGroup
                    value={formData.hasOwnChildren === null ? "" : formData.hasOwnChildren.toString()}
                    onValueChange={(value) => updateFormData("hasOwnChildren", value === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="hasChildren-yes" />
                      <Label htmlFor="hasChildren-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
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
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="hasPets-yes" />
                      <Label htmlFor="hasPets-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="false" id="hasPets-no" />
                      <Label htmlFor="hasPets-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 3: Fostering Type */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label>What type of fostering interests you?</Label>
                  <RadioGroup
                    value={formData.fosteringType}
                    onValueChange={(value) => updateFormData("fosteringType", value)}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {[
                      { value: "short-term", label: "Short-term fostering", desc: "Weeks to months" },
                      { value: "long-term", label: "Long-term fostering", desc: "Years of care" },
                      { value: "respite", label: "Respite care", desc: "Temporary relief" },
                      { value: "emergency", label: "Emergency placements", desc: "Immediate needs" },
                      { value: "parent-child", label: "Parent & child", desc: "Support families" },
                      { value: "not-sure", label: "Not sure yet", desc: "Exploring options" },
                    ].map((type) => (
                      <div
                        key={type.value}
                        className="flex items-start space-x-3 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                        <Label htmlFor={type.value} className="cursor-pointer flex-1">
                          <span className="font-medium">{type.label}</span>
                          <span className="block text-xs text-muted-foreground">{type.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Preferred age groups (select all that apply)</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { value: "0-4", label: "0-4 years", desc: "Babies & toddlers" },
                      { value: "5-10", label: "5-10 years", desc: "Primary age" },
                      { value: "11-15", label: "11-15 years", desc: "Secondary age" },
                      { value: "16+", label: "16+ years", desc: "Young adults" },
                    ].map((age) => (
                      <div
                        key={age.value}
                        onClick={() => toggleAgeGroup(age.value)}
                        className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.preferredAgeGroups.includes(age.value)
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary"
                        }`}
                      >
                        <Checkbox
                          checked={formData.preferredAgeGroups.includes(age.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <span className="font-medium">{age.label}</span>
                          <span className="block text-xs text-muted-foreground">{age.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Would you consider fostering siblings together?</Label>
                  <RadioGroup
                    value={formData.willingSiblings === null ? "" : formData.willingSiblings.toString()}
                    onValueChange={(value) => updateFormData("willingSiblings", value === "true")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="true" id="siblings-yes" />
                      <Label htmlFor="siblings-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors flex-1">
                      <RadioGroupItem value="false" id="siblings-no" />
                      <Label htmlFor="siblings-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 4: Experience & Timeframe */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label>Do you have experience working with children?</Label>
                  <RadioGroup
                    value={formData.experienceLevel}
                    onValueChange={(value) => updateFormData("experienceLevel", value)}
                    className="space-y-3"
                  >
                    {[
                      { value: "experienced", label: "Yes, extensive experience", desc: "Professional childcare, teaching, fostering, etc." },
                      { value: "some", label: "Some experience", desc: "Parenting, volunteering, family care" },
                      { value: "none", label: "New to this", desc: "Limited experience but eager to learn" },
                    ].map((exp) => (
                      <div
                        key={exp.value}
                        className="flex items-start space-x-3 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={exp.value} id={exp.value} className="mt-1" />
                        <Label htmlFor={exp.value} className="cursor-pointer flex-1">
                          <span className="font-medium">{exp.label}</span>
                          <span className="block text-xs text-muted-foreground">{exp.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>When would you like to start fostering?</Label>
                  <RadioGroup
                    value={formData.timeframe}
                    onValueChange={(value) => updateFormData("timeframe", value)}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {[
                      { value: "immediately", label: "As soon as possible" },
                      { value: "1-3-months", label: "Within 1-3 months" },
                      { value: "3-6-months", label: "Within 3-6 months" },
                      { value: "exploring", label: "Just exploring options" },
                    ].map((time) => (
                      <div
                        key={time.value}
                        className="flex items-center space-x-3 p-4 rounded-xl border hover:border-primary cursor-pointer transition-colors"
                      >
                        <RadioGroupItem value={time.value} id={time.value} />
                        <Label htmlFor={time.value} className="cursor-pointer flex-1">
                          {time.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 5: Final Steps */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="specialConsiderations">
                    Is there anything else you'd like us to know?
                  </Label>
                  <Textarea
                    id="specialConsiderations"
                    value={formData.specialConsiderations}
                    onChange={(e) => updateFormData("specialConsiderations", e.target.value)}
                    placeholder="Any questions, special considerations, or additional information..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationPreference">
                    Preferred location/agency preference (optional)
                  </Label>
                  <Input
                    id="locationPreference"
                    value={formData.locationPreference}
                    onChange={(e) => updateFormData("locationPreference", e.target.value)}
                    placeholder="e.g., Local to Manchester, specific agency name"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => updateFormData("marketingConsent", checked)}
                    />
                    <Label htmlFor="marketingConsent" className="text-sm text-muted-foreground cursor-pointer">
                      I'd like to receive helpful fostering information and updates via email
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onCheckedChange={(checked) => updateFormData("privacyAccepted", checked)}
                    />
                    <Label htmlFor="privacyAccepted" className="text-sm cursor-pointer">
                      I accept the privacy policy and agree to be contacted by a fostering advisor *
                    </Label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`rounded-full ${currentStep === 1 ? "invisible" : ""}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="rounded-full"
                disabled={
                  currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email)
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.privacyAccepted}
                className="rounded-full"
              >
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
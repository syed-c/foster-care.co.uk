import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2, Phone, Mail, Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  phone?: string | null;
}

interface AgencyBookingModalProps {
  agency: Agency | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AgencyBookingModal = ({ agency, isOpen, onClose }: AgencyBookingModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
  });

  if (!agency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "Booking Request Sent!",
      description: `${agency.name} will contact you within 24 hours.`,
    });

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", email: "", phone: "", message: "", preferredDate: "" });
      onClose();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {agency.logo_url ? (
              <img 
                src={agency.logo_url} 
                alt={agency.name} 
                className="w-12 h-12 rounded-xl object-cover border border-slate-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center border border-primary/30">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <DialogTitle className="text-lg font-bold text-white">
                Book with {agency.name}
              </DialogTitle>
              <DialogDescription className="text-white/50 text-sm">
                Request a callback or consultation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-verified/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-verified" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Request Sent!</h3>
            <p className="text-white/50 text-sm">
              {agency.name} will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70 text-sm">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-white/30 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70 text-sm flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-white/30 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/70 text-sm flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07xxx xxxxxx"
                  required
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-white/30 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-white/70 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Preferred Callback Date
              </Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
                className="bg-slate-800 border-slate-600 text-white rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white/70 text-sm">Message (optional)</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your fostering interest..."
                rows={3}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-white/30 rounded-lg resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-600 text-white/70 hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

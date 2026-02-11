"use client";
import { useOutletContext } from "@/context/WorkspaceContext";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  Save,
  Loader2,
  CheckCircle,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

export default function AgencyProfile() {
  const { agency, workspace, user } = useOutletContext<ContextType>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: agency?.name || "",
    short_description: agency?.short_description || "",
    description: agency?.description || "",
    phone: agency?.phone || "",
    email: agency?.email || "",
    website: agency?.website || "",
    address: agency?.address || "",
    city: agency?.city || "",
    county: agency?.county || "",
    postcode: agency?.postcode || "",
    complex_needs_support: agency?.complex_needs_support || false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Calculate profile completeness
  const requiredFields = [
    formData.name,
    formData.short_description,
    formData.description,
    formData.phone,
    formData.email,
    formData.address,
    formData.city,
    formData.postcode,
  ];
  const completedFields = requiredFields.filter(Boolean).length;
  const completeness = Math.round((completedFields / requiredFields.length) * 100);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      const { error } = await supabase
        .from("agencies")
        .update({
          name: formData.name,
          short_description: formData.short_description,
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          county: formData.county,
          postcode: formData.postcode,
          complex_needs_support: formData.complex_needs_support,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agency.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-agency"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agency Profile</h1>
          <p className="text-muted-foreground">Manage your public agency profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full" asChild>
            <a href={`/agencies/${agency?.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Public Profile
            </a>
          </Button>
          <Button 
            className="rounded-full" 
            onClick={() => saveMutation.mutate()}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Completeness */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion</span>
                <span className="text-2xl font-bold">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-3" />
              {completeness < 100 && (
                <p className="text-xs text-muted-foreground">
                  Complete your profile to increase visibility and trust
                </p>
              )}
              {completeness === 100 && (
                <div className="flex items-center gap-2 text-verified">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Profile complete!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm">Verified</span>
                {agency?.is_verified ? (
                  <Badge className="bg-verified/10 text-verified border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm">Featured</span>
                {agency?.is_featured ? (
                  <Badge className="bg-amber-500/10 text-amber-500 border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm">Active</span>
                {agency?.is_active ? (
                  <Badge className="bg-verified/10 text-verified border-0">Yes</Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {agency?.logo_url ? (
                  <img
                    src={agency.logo_url}
                    alt={agency.name}
                    className="w-24 h-24 rounded-2xl object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Button variant="outline" size="sm" className="rounded-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Agency Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief tagline for your agency"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of your agency, services, and approach"
                  rows={5}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    Phone
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01onal 123 4567"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@agency.co.uk"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Website
                </Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.agency.co.uk"
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 High Street"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="rounded-2xl border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border">
                <div>
                  <p className="font-medium">Complex Needs Support</p>
                  <p className="text-sm text-muted-foreground">
                    Indicate if your agency supports children with complex needs
                  </p>
                </div>
                <Switch
                  checked={formData.complex_needs_support}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, complex_needs_support: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

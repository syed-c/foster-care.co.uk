import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings, Globe, Mail, Phone, MapPin, Palette, 
  Share2, Bell, Shield, Save, Loader2, RefreshCw,
  Facebook, Twitter, Linkedin, Instagram
} from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  value_json: any;
  description: string | null;
  category: string;
}

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all settings
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("*")
        .order("category");
      if (error) return [];
      return data as SiteSetting[];
    },
  });

  // Update local state when data loads
  useEffect(() => {
    if (siteSettings) {
      const settingsMap: Record<string, string> = {};
      siteSettings.forEach((s: SiteSetting) => {
        settingsMap[s.key] = s.value || "";
      });
      setSettings(settingsMap);
    }
  }, [siteSettings]);

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (updates: { key: string; value: string }[]) => {
      for (const update of updates) {
        const { error } = await (supabase as any)
          .from("site_settings")
          .update({ value: update.value, updated_at: new Date().toISOString() })
          .eq("key", update.key);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (category: string) => {
    const categorySettings = siteSettings?.filter((s) => s.category === category) || [];
    const updates = categorySettings.map((s) => ({
      key: s.key,
      value: settings[s.key] || "",
    }));
    saveMutation.mutate(updates);
  };

  const renderInput = (key: string, label: string, placeholder?: string, type: string = "text", description?: string) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          id={key}
          value={settings[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <Input
          id={key}
          type={type}
          value={settings[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={placeholder}
        />
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout title="Site Settings" description="Configure your website settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings" description="Configure all aspects of your Foster Care UK website">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card border flex-wrap h-auto">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Share2 className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            SEO & Analytics
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic website configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {renderInput("site_name", "Site Name", "Foster Care UK")}
                {renderInput("site_tagline", "Site Tagline", "Find Trusted Foster Care Agencies")}
              </div>
              {renderInput("site_description", "Site Description", "Main site meta description...", "textarea", "Used as default meta description for SEO")}
              <Button onClick={() => handleSave("general")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                    placeholder="hello@fostercare.uk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ""}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    placeholder="0800 123 4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address / Location
                </Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => handleChange("contact_address", e.target.value)}
                  placeholder="Your business address..."
                  rows={2}
                />
              </div>
              <Button onClick={() => handleSave("contact")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Contact Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your brand appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {renderInput("logo_text", "Logo Text", "FC", "text", "Short text shown in logo circle")}
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      value={settings.primary_color || ""}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      placeholder="#0f766e"
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: settings.primary_color || "#0f766e" }}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave("branding")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Branding Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">
                    <Facebook className="w-4 h-4 inline mr-2" />
                    Facebook URL
                  </Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ""}
                    onChange={(e) => handleChange("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">
                    <Twitter className="w-4 h-4 inline mr-2" />
                    Twitter/X URL
                  </Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter || ""}
                    onChange={(e) => handleChange("social_twitter", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn URL
                  </Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => handleChange("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">
                    <Instagram className="w-4 h-4 inline mr-2" />
                    Instagram URL
                  </Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ""}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("social")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Social Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Settings */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Lead Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications when new leads are submitted
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_lead_notifications === "true"}
                    onCheckedChange={(checked) => handleChange("enable_lead_notifications", checked ? "true" : "false")}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new reviews without moderation
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_auto_approve_reviews === "true"}
                    onCheckedChange={(checked) => handleChange("enable_auto_approve_reviews", checked ? "true" : "false")}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Agency Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new agencies to register on the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_agency_registration === "true"}
                    onCheckedChange={(checked) => handleChange("enable_agency_registration", checked ? "true" : "false")}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("features")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Feature Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
              <CardDescription>Search engine optimization and tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {renderInput("google_analytics_id", "Google Analytics ID", "G-XXXXXXXXXX", "text", "Your GA4 measurement ID")}
                {renderInput("google_tag_manager_id", "Google Tag Manager ID", "GTM-XXXXXXX", "text", "Your GTM container ID")}
              </div>
              <Button onClick={() => handleSave("seo")} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

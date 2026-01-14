import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Settings, Key, Globe, Mail, Shield, Loader2, Save, RefreshCw,
  Bell, Palette, Share2, Database, Code, AlertTriangle, CheckCircle,
  Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube
} from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface SiteSetting {
  id: string;
  key: string;
  value: Json;
  description: string | null;
  category: string | null;
  updated_at: string | null;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all settings
  const { data: siteSettings, isLoading, refetch } = useQuery({
    queryKey: ["site-settings-all"],
    queryFn: async () => {
      const { data, error } = await supabase
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
      siteSettings.forEach((s) => {
        // Handle both string and JSON values
        const value = typeof s.value === 'string' ? s.value : JSON.stringify(s.value);
        settingsMap[s.key] = value;
      });
      setSettings(settingsMap);
    }
  }, [siteSettings]);

  // Upsert setting mutation
  const upsertMutation = useMutation({
    mutationFn: async ({ key, value, category, description }: { 
      key: string; 
      value: string; 
      category?: string;
      description?: string;
    }) => {
      const existingSetting = siteSettings?.find(s => s.key === key);
      
      if (existingSetting) {
        const { error } = await supabase
          .from("site_settings")
          .update({ 
            value: value as unknown as Json, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", existingSetting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ 
            key, 
            value: value as unknown as Json, 
            category: category || "general",
            description: description || null
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-all"] });
    },
  });

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveCategory = async (category: string, keys: string[]) => {
    setIsSaving(true);
    try {
      for (const key of keys) {
        await upsertMutation.mutateAsync({ 
          key, 
          value: settings[key] || "", 
          category 
        });
      }
      toast.success(`${category} settings saved`);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminSidebar title="Site Settings" description="Configure your website settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </SuperAdminSidebar>
    );
  }

  return (
    <SuperAdminSidebar title="Site Settings" description="Configure all aspects of your Foster Care UK website">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{siteSettings?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-card border flex-wrap h-auto p-1">
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
              <Code className="w-4 h-4 mr-2" />
              SEO & Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic website configuration and identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name || ""}
                      onChange={(e) => handleChange("site_name", e.target.value)}
                      placeholder="Foster Care UK"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_tagline">Site Tagline</Label>
                    <Input
                      id="site_tagline"
                      value={settings.site_tagline || ""}
                      onChange={(e) => handleChange("site_tagline", e.target.value)}
                      placeholder="Find Trusted Foster Care Agencies"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description || ""}
                    onChange={(e) => handleChange("site_description", e.target.value)}
                    placeholder="Main site meta description for SEO..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Used as default meta description for search engines</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="copyright_text">Copyright Text</Label>
                    <Input
                      id="copyright_text"
                      value={settings.copyright_text || ""}
                      onChange={(e) => handleChange("copyright_text", e.target.value)}
                      placeholder="© 2024 Foster Care UK. All rights reserved."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={settings.timezone || ""}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      placeholder="Europe/London"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveCategory("general", ["site_name", "site_tagline", "site_description", "copyright_text", "timezone"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Contact details displayed throughout the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
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
                    <Label htmlFor="contact_phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
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
                  <Label htmlFor="contact_address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Business Address
                  </Label>
                  <Textarea
                    id="contact_address"
                    value={settings.contact_address || ""}
                    onChange={(e) => handleChange("contact_address", e.target.value)}
                    placeholder="123 High Street, London, UK"
                    rows={2}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={settings.support_email || ""}
                      onChange={(e) => handleChange("support_email", e.target.value)}
                      placeholder="support@fostercare.uk"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_hours">Business Hours</Label>
                    <Input
                      id="business_hours"
                      value={settings.business_hours || ""}
                      onChange={(e) => handleChange("business_hours", e.target.value)}
                      placeholder="Mon-Fri 9am-5pm"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveCategory("contact", ["contact_email", "contact_phone", "contact_address", "support_email", "business_hours"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Contact Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Branding
                </CardTitle>
                <CardDescription>Customize your brand appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo_text">Logo Text</Label>
                    <Input
                      id="logo_text"
                      value={settings.logo_text || ""}
                      onChange={(e) => handleChange("logo_text", e.target.value)}
                      placeholder="FC"
                    />
                    <p className="text-xs text-muted-foreground">Short text shown in logo if no image is set</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={settings.logo_url || ""}
                      onChange={(e) => handleChange("logo_url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
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
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        value={settings.secondary_color || ""}
                        onChange={(e) => handleChange("secondary_color", e.target.value)}
                        placeholder="#f0fdfa"
                        className="flex-1"
                      />
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: settings.secondary_color || "#f0fdfa" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        value={settings.accent_color || ""}
                        onChange={(e) => handleChange("accent_color", e.target.value)}
                        placeholder="#14b8a6"
                        className="flex-1"
                      />
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: settings.accent_color || "#14b8a6" }}
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveCategory("branding", ["logo_text", "logo_url", "primary_color", "secondary_color", "accent_color"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Branding Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Social Media Links
                </CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook" className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Label>
                    <Input
                      id="social_facebook"
                      value={settings.social_facebook || ""}
                      onChange={(e) => handleChange("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter" className="flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      Twitter/X
                    </Label>
                    <Input
                      id="social_twitter"
                      value={settings.social_twitter || ""}
                      onChange={(e) => handleChange("social_twitter", e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin" className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="social_linkedin"
                      value={settings.social_linkedin || ""}
                      onChange={(e) => handleChange("social_linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram" className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      id="social_instagram"
                      value={settings.social_instagram || ""}
                      onChange={(e) => handleChange("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube" className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </Label>
                    <Input
                      id="social_youtube"
                      value={settings.social_youtube || ""}
                      onChange={(e) => handleChange("social_youtube", e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveCategory("social", ["social_facebook", "social_twitter", "social_linkedin", "social_instagram", "social_youtube"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Social Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Settings */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Feature Toggles
                </CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Compare Feature</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to compare multiple agencies side by side
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_compare !== "false"}
                    onCheckedChange={(checked) => handleChange("enable_compare", checked ? "true" : "false")}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Blog Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow comments on blog posts
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_blog_comments === "true"}
                    onCheckedChange={(checked) => handleChange("enable_blog_comments", checked ? "true" : "false")}
                  />
                </div>
                <Button 
                  onClick={() => handleSaveCategory("features", ["enable_lead_notifications", "enable_auto_approve_reviews", "enable_agency_registration", "enable_compare", "enable_blog_comments"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Feature Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  SEO & Analytics
                </CardTitle>
                <CardDescription>Search engine optimization and tracking configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                    <Input
                      id="google_analytics_id"
                      value={settings.google_analytics_id || ""}
                      onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground">Your GA4 measurement ID</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                    <Input
                      id="google_tag_manager_id"
                      value={settings.google_tag_manager_id || ""}
                      onChange={(e) => handleChange("google_tag_manager_id", e.target.value)}
                      placeholder="GTM-XXXXXXX"
                    />
                    <p className="text-xs text-muted-foreground">Your GTM container ID</p>
                  </div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="google_search_console_verification">Search Console Verification</Label>
                    <Input
                      id="google_search_console_verification"
                      value={settings.google_search_console_verification || ""}
                      onChange={(e) => handleChange("google_search_console_verification", e.target.value)}
                      placeholder="verification-code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bing_verification">Bing Verification</Label>
                    <Input
                      id="bing_verification"
                      value={settings.bing_verification || ""}
                      onChange={(e) => handleChange("bing_verification", e.target.value)}
                      placeholder="verification-code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="robots_txt_custom">Custom Robots.txt Rules</Label>
                  <Textarea
                    id="robots_txt_custom"
                    value={settings.robots_txt_custom || ""}
                    onChange={(e) => handleChange("robots_txt_custom", e.target.value)}
                    placeholder="Disallow: /admin/&#10;Disallow: /private/"
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={() => handleSaveCategory("seo", ["google_analytics_id", "google_tag_manager_id", "google_search_console_verification", "bing_verification", "robots_txt_custom"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save SEO Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">User Role Management</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        User roles and permissions are managed through the Users page. Only super admins can manage other admin accounts.
                      </p>
                      <Button variant="outline" className="mt-3" asChild>
                        <a href="/admin/users">Manage User Roles</a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require users to verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.require_email_verification === "true"}
                    onCheckedChange={(checked) => handleChange("require_email_verification", checked ? "true" : "false")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <Button 
                  onClick={() => handleSaveCategory("security", ["require_email_verification"])} 
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminSidebar>
  );
}
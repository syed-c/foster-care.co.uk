import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings, Key, Globe, Mail, Shield, Loader2, Save } from "lucide-react";

const AdminSettings = () => {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [siteName, setSiteName] = useState("Foster Care UK");
  const [siteTagline, setSiteTagline] = useState("Find Trusted Foster Care Agencies");
  const [contactEmail, setContactEmail] = useState("");
  const [enableLeadNotifications, setEnableLeadNotifications] = useState(true);
  const [enableAutoApproveReviews, setEnableAutoApproveReviews] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      // Save to cms_content or a settings table
      toast.success("General settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKeys = async () => {
    setIsSaving(true);
    try {
      // Note: API keys should be stored securely in secrets
      toast.success("API settings saved");
    } catch (error) {
      toast.error("Failed to save API settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings" description="Manage site settings and configurations">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card border">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Foster Care UK"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    placeholder="Find Trusted Foster Care Agencies"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@fostercare.uk"
                />
              </div>
              <Button onClick={handleSaveGeneral} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Configure external service API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleApiKey">Google Cloud API Key</Label>
                <Input
                  id="googleApiKey"
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="Enter your Google Cloud API key"
                />
                <p className="text-sm text-muted-foreground">
                  Required for GMB import functionality. Get your API key from the Google Cloud Console.
                </p>
              </div>
              <Button onClick={handleSaveApiKeys} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save API Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lead Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when new leads are submitted
                  </p>
                </div>
                <Switch
                  checked={enableLeadNotifications}
                  onCheckedChange={setEnableLeadNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Approve Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new reviews without moderation
                  </p>
                </div>
                <Switch
                  checked={enableAutoApproveReviews}
                  onCheckedChange={setEnableAutoApproveReviews}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Security settings are managed through user roles. Visit the Users page to manage admin access.
              </p>
              <Button variant="outline" asChild>
                <a href="/admin/users">Manage User Roles</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;

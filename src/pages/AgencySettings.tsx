import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Building2, 
  Save, 
  Loader2
} from "lucide-react";

interface AgencyFormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  website: string;
  ofsted_rating: string;
  logo_url: string;
  cover_image_url: string;
}

const AgencySettings = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AgencyFormData>({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    website: "",
    ofsted_rating: "",
    logo_url: "",
    cover_image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch agency owned by this user
  const { data: agency, isLoading: agencyLoading } = useQuery({
    queryKey: ["user-agency", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || "",
        description: agency.description || "",
        email: agency.email || "",
        phone: agency.phone || "",
        address: agency.address || "",
        city: agency.city || "",
        postcode: agency.postcode || "",
        website: agency.website || "",
        ofsted_rating: agency.ofsted_rating || "",
        logo_url: agency.logo_url || "",
        cover_image_url: agency.cover_image_url || "",
      });
    }
  }, [agency]);

  const updateAgencyMutation = useMutation({
    mutationFn: async (updatedData: Partial<AgencyFormData>) => {
      if (!agency?.id) throw new Error("Agency not found");
      
      const { error } = await supabase
        .from("agencies")
        .update(updatedData)
        .eq("id", agency.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-agency", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["agency", agency?.slug] });
      toast.success("Agency profile updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating agency:", error);
      toast.error("Failed to update agency profile. Please try again.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    updateAgencyMutation.mutate(formData);
    setIsSubmitting(false);
  };

  const handleImageUpload = async (file: File, field: 'logo_url' | 'cover_image_url') => {
    try {
      if (!agency?.id) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}_${Date.now()}.${fileExt}`;
      const filePath = `${agency.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('agency-images')
        .getPublicUrl(filePath);

      if (!publicUrl?.publicUrl) throw new Error('Could not get public URL');

      // Update the form data
      setFormData(prev => ({ ...prev, [field]: publicUrl.publicUrl }));
      
      // Save the updated agency information
      const updateData = { [field]: publicUrl.publicUrl };
      const { error: updateError } = await supabase
        .from('agencies')
        .update(updateData)
        .eq('id', agency.id);
      
      if (updateError) throw updateError;

      toast.success(`${field === 'logo_url' ? 'Logo' : 'Cover image'} uploaded and saved successfully!`);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload ${field === 'logo_url' ? 'logo' : 'cover image'}. Please try again.`);
    }
  };

  if (loading || agencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col bg-background-warm">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-semibold mb-4">No Agency Found</h1>
            <p className="text-muted-foreground mb-8">
              You don't have an agency profile to edit. Claim your existing agency or register a new one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/claim">Claim Your Agency</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Register New Agency</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-warm">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
            <h1 className="text-3xl font-semibold">Agency Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Agency Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell people about your agency..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
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
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Agency Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Logo</h3>
                    <div className="flex items-center gap-6">
                      {formData.logo_url && (
                        <img 
                          src={formData.logo_url} 
                          alt="Current logo" 
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'logo_url');
                          }}
                        />
                        <p className="text-xs text-muted-foreground">Max size: 2MB, JPG/PNG</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Cover Image</h3>
                    <div className="space-y-4">
                      {formData.cover_image_url && (
                        <img 
                          src={formData.cover_image_url} 
                          alt="Current cover" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'cover_image_url');
                          }}
                        />
                        <p className="text-xs text-muted-foreground">Recommended: 1200x400px, Max size: 5MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Agency Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        {agency.is_verified 
                          ? "Your agency is verified and trusted."
                          : "Your agency is pending verification."}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      agency.is_verified 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {agency.is_verified ? "Verified" : "Pending"}
                    </div>
                  </div>
                  
                  {agency.ofsted_rating && (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Ofsted Rating</h4>
                        <p className="text-sm text-muted-foreground">
                          Current inspection rating
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {agency.ofsted_rating}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    To update your verification status or Ofsted details, please contact our support team.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgencySettings;

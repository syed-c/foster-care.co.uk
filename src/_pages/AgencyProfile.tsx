"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  Star, MapPin, BadgeCheck, ArrowLeft, Heart, AlertCircle, Loader2,
  Phone, Mail, Globe, Clock, Shield, Users, CheckCircle, Info,
  ExternalLink, Share2, Building2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAgencyBySlug } from "@/hooks/useAgencies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";
import { ReviewForm } from "@/components/agency/ReviewForm";
import { useUserRoles } from "@/hooks/useUserRoles";
import { SEOHead, getAgencySchema, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { BackToTop } from "@/components/shared/BackToTop";

export default function AgencyProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: agency, isLoading, error } = useAgencyBySlug(slug);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const { isAdmin } = useUserRoles();
  const { data: reviews } = useQuery({
    queryKey: ["agencyReviews", agency?.id],
    queryFn: async () => {
      if (!agency?.id) return [];
      let query = supabase
        .from("reviews")
        .select("*")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (!isAdmin) {
        query = query.eq("is_approved", true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Determine profile status - use claim_status from DB
  const isVerified = agency?.is_verified === true;
  const isClaimed = agency?.claim_status === 'claimed';
  const isUnclaimed = agency?.claim_status !== 'claimed';

  // Get specialisms for this agency
  const { data: agencySpecialisms } = useQuery({
    queryKey: ["agencySpecialisms", agency?.id],
    queryFn: async () => {
      if (!agency?.id) return [];
      const { data, error } = await supabase
        .from("agency_specialisms")
        .select("specialism_id, specialisms(name, slug)")
        .eq("agency_id", agency.id);
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  // Get locations for this agency
  const { data: agencyLocations } = useQuery({
    queryKey: ["agencyLocations", agency?.id],
    queryFn: async () => {
      if (!agency?.id) return [];
      const { data, error } = await supabase
        .from("agency_locations")
        .select("location_id, locations(name, slug)")
        .eq("agency_id", agency.id);
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Agencies", url: "/agencies" },
    { name: agency?.name || "Agency", url: `/agencies/${slug}` },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-28 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading agency profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-28">
          <div className="container-main py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Agency Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The agency you're looking for doesn't exist or may have been removed from our directory.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/agencies">Browse All Agencies</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use agency_locations for service areas
  const serviceAreas = agencyLocations?.map(al => (al.locations as any)?.name).filter(Boolean) || [];
  // Use acceptance_types as services fallback
  const services = agency.acceptance_types || [];
  // Use agency_specialisms for specializations
  const specializations = agencySpecialisms?.map(as => (as.specialisms as any)?.name).filter(Boolean) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={`${agency.name} | Foster Care Agency in ${agency.city || 'England'}`}
        description={agency.description || `${agency.name} is a foster care agency serving ${agency.city || 'England'}. Find reviews, contact details, and more.`}
        canonicalUrl={`https://fostercare.uk/agencies/${slug}`}
        structuredData={getAgencySchema(agency)}
      />
      <Header />

      <main className="flex-1 pt-20">
        {/* Unclaimed Notice Banner */}
        {isUnclaimed && (
          <div className="bg-unclaimed-light border-b border-unclaimed/20">
            <div className="container-main py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-unclaimed-foreground flex-shrink-0" />
                  <p className="text-sm text-unclaimed-foreground">
                    <strong>Auto-generated profile</strong> – This listing was created using publicly available information. Some details may be limited.
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-full bg-unclaimed text-white hover:bg-unclaimed/90 whitespace-nowrap"
                  asChild
                >
                  <Link href={`/claim?agency=${agency.id}`}>
                    Claim This Listing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-[5%] w-80 h-80 bg-warm/5 rounded-full blur-3xl" />
          </div>

          <div className="container-main relative z-10">
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Agencies
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Agency Info */}
              <div className="flex-1">
                <div className="flex items-start gap-5 mb-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {agency.logo_url ? (
                      <img
                        src={agency.logo_url}
                        alt={`${agency.name} logo`}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-card border border-border/50"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center shadow-soft">
                        <Building2 className="w-10 h-10 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Name & Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {isVerified ? (
                        <span className="badge-verified">
                          <BadgeCheck className="w-4 h-4" />
                          Verified Agency
                        </span>
                      ) : isUnclaimed ? (
                        <span className="badge-unclaimed">
                          <Info className="w-4 h-4" />
                          Unclaimed Profile
                        </span>
                      ) : (
                        <span className="badge-pill">
                          <CheckCircle className="w-4 h-4" />
                          Claimed
                        </span>
                      )}
                      {agency.is_featured && (
                        <span className="badge-featured">
                          <Sparkles className="w-4 h-4" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                      {agency.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      {agency.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="font-semibold text-foreground">{Number(agency.rating).toFixed(1)}</span>
                          </div>
                          {agency.review_count && (
                            <span className="text-sm">({agency.review_count} reviews)</span>
                          )}
                        </div>
                      )}
                      {agency.city && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{agency.city}, England</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    size="lg" 
                    className="rounded-full"
                    onClick={() => setShowLeadForm(true)}
                  >
                    Request Information
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full" asChild>
                    <Link href={`/agencies/${slug}/feedback`}>
                      <Star className="w-4 h-4 mr-2" />
                      Leave Feedback
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Quick Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-80"
              >
                <Card className="card-elevated">
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-4">Quick Info</h3>
                    <div className="space-y-4">
                      {agency.ofsted_rating && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">Ofsted Rating</span>
                          <Badge className={
                            agency.ofsted_rating.toLowerCase() === 'outstanding' 
                              ? 'bg-verified/15 text-verified border-verified/20' 
                              : agency.ofsted_rating.toLowerCase() === 'good'
                              ? 'bg-primary/15 text-primary border-primary/20'
                              : 'bg-unclaimed-light text-unclaimed-foreground border-unclaimed/20'
                          }>
                            {agency.ofsted_rating}
                          </Badge>
                        </div>
                      )}
                      {serviceAreas.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">Service Areas</span>
                          <span className="font-medium">{serviceAreas.length} regions</span>
                        </div>
                      )}
                      {agency.phone && isClaimed && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">Phone</span>
                          <a href={`tel:${agency.phone}`} className="font-medium text-primary hover:underline">
                            {agency.phone}
                          </a>
                        </div>
                      )}
                      {agency.website && isClaimed && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">Website</span>
                          <a 
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center gap-1"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {agency.ofsted_urn && (
                      <>
                        <Separator className="my-4" />
                        <a 
                          href={`https://reports.ofsted.gov.uk/provider/45/${agency.ofsted_urn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-border hover:bg-accent transition-colors text-sm font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          View Ofsted Report
                        </a>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding bg-background-warm">
          <div className="container-main">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* About Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card-elevated p-8"
                >
                  <h2 className="font-display text-xl font-semibold mb-4">About {agency.name}</h2>
                  {agency.description ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {agency.description}
                    </p>
                  ) : (
                    <div className="text-center py-6">
                      <Info className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        {isUnclaimed 
                          ? "Detailed information will be available once this agency claims their profile."
                          : "No description available yet."}
                      </p>
                    </div>
                  )}

                  {isUnclaimed && (
                    <div className="mt-6 p-4 bg-unclaimed-light rounded-2xl border border-unclaimed/20">
                      <p className="text-sm text-unclaimed-foreground">
                        <strong>Are you from this agency?</strong> Claim this listing to add detailed information, respond to reviews, and connect with potential foster carers.
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-3 rounded-full"
                        variant="outline"
                        asChild
                      >
                        <Link href={`/claim?agency=${agency.id}`}>
                          Claim This Profile
                        </Link>
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Service Areas */}
                {serviceAreas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-elevated p-8"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">
                      <MapPin className="w-5 h-5 inline mr-2 text-primary" />
                      Areas Served
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-primary/10 text-foreground text-sm font-medium"
                        >
                          {String(area)}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Specialisms */}
                {specializations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-elevated p-8"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">
                      <Users className="w-5 h-5 inline mr-2 text-primary" />
                      Specialisms
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="px-4 py-2">
                          {String(spec)}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Services */}
                {services.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-elevated p-8"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">
                      <CheckCircle className="w-5 h-5 inline mr-2 text-primary" />
                      Services & Acceptance Types
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service, index) => (
                        <Badge key={index} variant="outline" className="px-4 py-2">
                          {String(service)}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Reviews Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="card-elevated p-8"
                >
                  <h2 className="font-display text-xl font-semibold mb-6">
                    <Star className="w-5 h-5 inline mr-2 text-primary" />
                    Reviews
                  </h2>
                  
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              by {review.author_name}
                            </span>
                          </div>
                          {review.title && (
                            <h4 className="font-medium mb-1">{review.title}</h4>
                          )}
                          <p className="text-muted-foreground text-sm">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to share your experience</p>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  <ReviewForm agencyId={agency.id} agencyName={agency.name} />
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <Card className="card-elevated sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-4">Contact This Agency</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Interested in learning more? Get in touch with {agency.name} to start your fostering journey.
                    </p>
                    <Button 
                      className="w-full rounded-full"
                      onClick={() => setShowLeadForm(true)}
                    >
                      Request Information
                    </Button>
                    
                    {isClaimed && (
                      <div className="mt-6 space-y-3">
                        {agency.phone && (
                          <a 
                            href={`tel:${agency.phone}`}
                            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent transition-colors"
                          >
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="text-sm">{agency.phone}</span>
                          </a>
                        )}
                        {agency.email && (
                          <a 
                            href={`mailto:${agency.email}`}
                            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent transition-colors"
                          >
                            <Mail className="w-5 h-5 text-primary" />
                            <span className="text-sm">{agency.email}</span>
                          </a>
                        )}
                        {agency.website && (
                          <a 
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent transition-colors"
                          >
                            <Globe className="w-5 h-5 text-primary" />
                            <span className="text-sm">Visit Website</span>
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      {/* Lead Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Information from {agency.name}</DialogTitle>
          </DialogHeader>
          <MultiStepLeadForm 
            sourceAgencyId={agency.id}
            onSuccess={() => setShowLeadForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

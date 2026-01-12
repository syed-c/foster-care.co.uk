import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  // Determine profile status
  const isVerified = agency?.is_verified === true;
  const isClaimed = agency?.is_claimed === true;
  const isUnclaimed = !isClaimed;

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
              <Link to="/agencies">Browse All Agencies</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const serviceAreas = Array.isArray(agency.service_areas) ? agency.service_areas : [];
  const services = Array.isArray(agency.services) ? agency.services : [];
  const specializations = Array.isArray(agency.specializations) ? agency.specializations : [];

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
                  <Link to={`/claim?agency=${agency.id}`}>
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
              to="/agencies"
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

                    {agency.ofsted_report_url && (
                      <>
                        <Separator className="my-4" />
                        <a 
                          href={agency.ofsted_report_url}
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
                        <Link to={`/claim?agency=${agency.id}`}>
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
                {(specializations.length > 0 || services.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="card-elevated p-8"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">
                      <Users className="w-5 h-5 inline mr-2 text-primary" />
                      Fostering Specialisms
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(specializations.length > 0 ? specializations : services).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border/50"
                        >
                          <CheckCircle className="w-5 h-5 text-verified flex-shrink-0" />
                          <span className="text-foreground">{String(item)}</span>
                        </div>
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold">
                      Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
                    </h2>
                    {agency.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(Number(agency.rating))
                                  ? "text-primary fill-primary"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{Number(agency.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className={`p-5 rounded-2xl bg-background border ${
                            !review.is_approved ? "border-unclaimed/30" : "border-border/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-foreground">{review.author_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("en-GB", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              {!review.is_approved && isAdmin && (
                                <Badge variant="outline" className="mt-1 bg-unclaimed/20 text-unclaimed border-unclaimed">
                                  Pending Approval
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                              ))}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-medium mb-2 text-foreground">{review.title}</h4>
                          )}
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <h3 className="font-display font-semibold mb-4">Leave a Review</h3>
                  <ReviewForm agencyId={agency.id} agencyName={agency.name} />
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* CTA Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-elevated sticky top-24 overflow-hidden">
                    <div className="bg-primary p-6 text-primary-foreground">
                      <h3 className="font-display font-semibold text-lg mb-2">Interested in Fostering?</h3>
                      <p className="text-primary-foreground/80 text-sm">
                        Connect with {agency.name} to learn about becoming a foster carer.
                      </p>
                    </div>
                    <CardContent className="p-6">
                      <Button
                        className="w-full rounded-full mb-4"
                        size="lg"
                        onClick={() => setShowLeadForm(true)}
                      >
                        Request Information
                      </Button>
                      
                      {isClaimed && agency.phone && (
                        <a
                          href={`tel:${agency.phone}`}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-border hover:bg-accent transition-colors text-sm font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Call {agency.phone}
                        </a>
                      )}

                      {isClaimed && agency.email && (
                        <a
                          href={`mailto:${agency.email}`}
                          className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-full border border-border hover:bg-accent transition-colors text-sm font-medium"
                        >
                          <Mail className="w-4 h-4" />
                          Send Email
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Trust Signals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="card-warm">
                    <CardContent className="p-6">
                      <h3 className="font-display font-semibold mb-4">Trust & Verification</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm">
                          {isVerified ? (
                            <CheckCircle className="w-5 h-5 text-verified" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted" />
                          )}
                          <span className={isVerified ? "text-foreground" : "text-muted-foreground"}>
                            Profile Verified
                          </span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          {agency.ofsted_rating ? (
                            <CheckCircle className="w-5 h-5 text-verified" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted" />
                          )}
                          <span className={agency.ofsted_rating ? "text-foreground" : "text-muted-foreground"}>
                            Ofsted Registered
                          </span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          {isClaimed ? (
                            <CheckCircle className="w-5 h-5 text-verified" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted" />
                          )}
                          <span className={isClaimed ? "text-foreground" : "text-muted-foreground"}>
                            Listing Claimed
                          </span>
                        </li>
                      </ul>
                      <Separator className="my-4" />
                      <Link
                        to="/how-listings-work"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        How we verify agencies
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Agencies */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <h2 className="font-display text-2xl font-bold mb-8 text-center">
              Similar Agencies in {agency.city || "England"}
            </h2>
            <div className="text-center">
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to={`/agencies?location=${agency.city || ""}`}>
                  View All Agencies
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      {/* Lead Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display">Request Information from {agency.name}</DialogTitle>
          </DialogHeader>
          <MultiStepLeadForm
            sourceType="agency_profile"
            sourceAgencyId={agency.id}
            onSuccess={() => setShowLeadForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

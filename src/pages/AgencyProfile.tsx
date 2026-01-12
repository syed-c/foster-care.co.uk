import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck, ArrowLeft, Heart, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAgencyBySlug } from "@/hooks/useAgencies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";
import { ReviewForm } from "@/components/agency/ReviewForm";
import { useUserRoles } from "@/hooks/useUserRoles";

export default function AgencyProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: agency, isLoading, error } = useAgencyBySlug(slug);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Fetch reviews for this agency
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
      
      // Only show approved reviews to non-admins
      if (!isAdmin) {
        query = query.eq("is_approved", true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!agency?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <div className="container-main py-16 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Agency Not Found</h1>
            <p className="text-foreground/80 mb-6">
              The agency you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-background-warm py-12 md:py-16">
          <div className="container-main">
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Agencies
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                    {agency.name}
                  </h1>
                  {agency.is_verified ? (
                    <BadgeCheck className="w-8 h-8 text-primary" />
                  ) : !agency.is_claimed ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                      Unclaimed
                    </Badge>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {agency.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="font-semibold text-foreground">{Number(agency.rating).toFixed(1)}</span>
                      </div>
                      {agency.review_count && (
                        <span className="text-foreground/60">({agency.review_count} reviews)</span>
                      )}
                    </div>
                  )}
                  {agency.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {agency.city}
                      {serviceAreas.length > 0 && ` +${serviceAreas.length} more areas`}
                    </div>
                  )}
                </div>

                {/* Claim button for unclaimed agencies */}
                {!agency.is_claimed && (
                  <div className="mt-4">
                    <Button variant="secondary" asChild>
                      <Link to={`/claim?agency=${agency.id}`}>
                        Claim This Agency
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg">
                  <Heart className="w-5 h-5" />
                  Save
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setShowLeadForm(true)}>
                  Get in Touch
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                {agency.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4">About</h2>
                    <p className="text-foreground/80 leading-relaxed">
                      {agency.description}
                    </p>
                  </motion.div>
                )}

                {/* Locations */}
                {serviceAreas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4">Service Areas</h2>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((location, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium"
                        >
                          {String(location)}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Services */}
                {services.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4">Services</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 rounded-xl bg-background-warm"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{String(service)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4">Reviews ({reviews.length})</h2>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card className={`bg-card text-foreground hover:scale-105 transition-transform duration-300 border border-border/50 shadow-sm rounded-xl overflow-hidden ${!review.is_approved ? 'border-2 border-amber-500/30' : ''}`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-foreground">{review.author_name}</p>
                                <p className="text-sm text-foreground/60">
                                  {new Date(review.created_at).toLocaleDateString('en-GB', {
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                                {!review.is_approved && isAdmin && (
                                  <Badge variant="outline" className="mt-1 bg-amber-500/20 text-amber-500 border-amber-500">
                                    Pending Approval
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                                ))}
                              </div>
                            </div>
                            {review.title && (
                              <h4 className="font-medium mb-2 text-foreground">{review.title}</h4>
                            )}
                            <p className="text-foreground/80">{review.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Add Review Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
                  <ReviewForm agencyId={agency.id} agencyName={agency.name} />
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-card text-foreground hover:scale-105 border border-border/50 transition-transform duration-300 shadow-sm rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">Interested in Fostering?</h3>
                      <p className="text-foreground/80 text-sm mb-4">
                        Get in touch with this agency to learn more about becoming a foster carer.
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full bg-background text-foreground hover:bg-background/90"
                        onClick={() => setShowLeadForm(true)}
                      >
                        Request Information
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {agency.ofsted_rating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3">Ofsted Rating</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            agency.ofsted_rating.toLowerCase() === 'outstanding' 
                              ? 'bg-green-100 text-green-700' 
                              : agency.ofsted_rating.toLowerCase() === 'good'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }>
                            {agency.ofsted_rating}
                          </Badge>
                        </div>
                        {agency.ofsted_report_url && (
                          <a 
                            href={agency.ofsted_report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-2 block"
                          >
                            View Ofsted Report →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Lead Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Information from {agency.name}</DialogTitle>
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

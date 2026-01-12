import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building2, Users, Heart, Shield, Phone, CheckCircle, Star, ExternalLink, Award, GraduationCap, Clock, ArrowRight, Sparkles, Globe } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocationBySlug, useChildLocations, useLocationPath, buildLocationUrl, Location } from "@/hooks/useLocations";
import { useAgenciesByLocation, useFeaturedAgencies } from "@/hooks/useAgencies";
import { useCmsContentByPage, useFaqsByPage, getContentBySection } from "@/hooks/useCmsContent";
import { useFaqsByLocation } from "@/hooks/useFaqs";
import { FaqSection } from "@/components/shared/FaqSection";
import { MultiStepLeadForm } from "@/components/forms/MultiStepLeadForm";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead, getBreadcrumbSchema, getFaqSchema } from "@/components/seo/SEOHead";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Location type to gradient mapping
const typeGradients: Record<string, string> = {
  country: "from-rose-500/10 via-orange-500/5 to-amber-500/10",
  region: "from-blue-500/10 via-indigo-500/5 to-violet-500/10",
  county: "from-emerald-500/10 via-teal-500/5 to-cyan-500/10",
  city: "from-amber-500/10 via-yellow-500/5 to-lime-500/10",
};

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  "england": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "northern-ireland": "🇬🇧",
};

export default function LocationPage() {
  const params = useParams();
  const slug = params.city || params.county || params.region || params.country;
  
  const { data: location, isLoading: locationLoading } = useLocationBySlug(slug);
  const { data: childLocations, isLoading: childrenLoading } = useChildLocations(location?.id);
  const { data: locationPath } = useLocationPath(location?.id);
  const { data: locationFaqs } = useFaqsByLocation(location?.id);
  const { data: locationAgencies } = useAgenciesByLocation(location?.id, 6);
  const { data: featuredAgencies } = useFeaturedAgencies(6);
  
  // Build CMS page_key with location_ prefix
  const cmsPageKey = slug ? `location_${slug}` : undefined;
  
  // Fetch CMS content and FAQs by page_key
  const { data: cmsContent } = useCmsContentByPage(cmsPageKey);
  const { data: pageFaqs } = useFaqsByPage(cmsPageKey);

  const isLoading = locationLoading || childrenLoading;

  // Get specific content sections
  const heroContent = getContentBySection(cmsContent, 'hero');
  const whyFosteringContent = getContentBySection(cmsContent, 'why_fostering');
  const agencyTypesContent = getContentBySection(cmsContent, 'agency_types');
  const fosteringTypesContent = getContentBySection(cmsContent, 'fostering_types');
  const howToContent = getContentBySection(cmsContent, 'how_to');
  const supportContent = getContentBySection(cmsContent, 'support');

  // Combine FAQs from location and page
  const allFaqs = [...(locationFaqs || []), ...(pageFaqs || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <section className="relative py-20 md:py-28">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background-warm to-background-sand" />
            <div className="container-main relative z-10">
              <Skeleton className="h-6 w-64 mb-6" />
              <div className="flex items-center gap-5 mb-6">
                <Skeleton className="w-20 h-20 rounded-3xl" />
                <div className="flex-1">
                  <Skeleton className="h-12 w-80 mb-3" />
                  <Skeleton className="h-6 w-96" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Location Not Found</h1>
            <p className="text-muted-foreground mb-8">The location you're looking for doesn't exist or may have been moved.</p>
            <Button asChild>
              <Link to="/locations">Browse All Locations</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasChildLocations = childLocations && childLocations.length > 0;
  const totalAgencies = hasChildLocations 
    ? childLocations.reduce((sum, loc) => sum + (loc.agency_count || 0), 0)
    : location.agency_count || 0;

  const breadcrumbItems = [
    { name: "Home", url: "https://fostercare.uk" },
    { name: "Locations", url: "https://fostercare.uk/locations" },
  ];
  
  if (locationPath) {
    locationPath.forEach((loc, index) => {
      const pathToLoc = locationPath.slice(0, index + 1);
      breadcrumbItems.push({
        name: loc.name,
        url: `https://fostercare.uk${buildLocationUrl(pathToLoc)}`,
      });
    });
  }

  const getChildLocationUrl = (childLoc: Location): string => {
    if (locationPath) {
      return buildLocationUrl([...locationPath, childLoc]);
    }
    return `/locations/${childLoc.slug}`;
  };

  const faqsForSchema = allFaqs?.map(f => ({ question: f.question, answer: f.answer })) || [];
  
  const getChildTypeName = () => {
    switch (location.type) {
      case "country": return "Regions";
      case "region": return "Counties";
      case "county": return "Cities & Towns";
      default: return "Areas";
    }
  };

  const currentPath = locationPath ? buildLocationUrl(locationPath) : `/locations/${location.slug}`;
  const agencies = locationAgencies && locationAgencies.length > 0 ? locationAgencies : featuredAgencies;
  const isShowingFeatured = !locationAgencies || locationAgencies.length === 0;
  const gradient = typeGradients[location.type] || typeGradients.region;
  
  // Get flag for countries
  const flag = location.type === 'country' ? countryFlags[location.slug] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={heroContent?.title || location.seo_title || `Foster Care Agencies in ${location.name} | Find Local Fostering Support`}
        description={heroContent?.content?.slice(0, 160) || location.seo_description || `Discover trusted foster care agencies in ${location.name}. Compare ${totalAgencies}+ verified fostering agencies and start your journey today.`}
        canonicalUrl={`https://fostercare.uk${currentPath}`}
        keywords={[`foster care ${location.name}`, `fostering agencies ${location.name}`, `become foster carer ${location.name}`, location.name]}
        structuredData={{
          ...getBreadcrumbSchema(breadcrumbItems),
          ...(faqsForSchema.length > 0 ? getFaqSchema(faqsForSchema) : {}),
        }}
      />
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero Section - Modern Gradient Design */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background-warm to-background-sand" />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/30 rounded-full blur-3xl" />
          </div>

          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="container-main relative z-10">
            {/* Breadcrumb */}
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap"
            >
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/locations" className="hover:text-foreground transition-colors">Locations</Link>
              {locationPath && locationPath.slice(0, -1).map((loc, index) => (
                <span key={loc.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Link to={buildLocationUrl(locationPath.slice(0, index + 1))} className="hover:text-foreground transition-colors">
                    {loc.name}
                  </Link>
                </span>
              ))}
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{location.name}</span>
            </motion.nav>

            <div className="max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-start gap-6 mb-8"
              >
                {/* Icon/Flag */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl shadow-lg shadow-primary/10 flex-shrink-0">
                  {flag || <MapPin className="w-10 h-10 text-primary" />}
                </div>
                
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-3"
                  >
                    <Badge variant="secondary" className="px-3 py-1 text-xs font-medium capitalize bg-background/80 backdrop-blur-sm">
                      {location.type}
                    </Badge>
                    {totalAgencies > 0 && (
                      <Badge variant="secondary" className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-0">
                        {totalAgencies} Agencies
                      </Badge>
                    )}
                  </motion.div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                    {heroContent?.title || `Foster Care Agencies in ${location.name}`}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-foreground-muted max-w-3xl leading-relaxed">
                    {heroContent?.content || location.description || `Find trusted foster care agencies in ${location.name}. Compare verified agencies and take the first step on your fostering journey.`}
                  </p>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{totalAgencies}</p>
                      <p className="text-sm text-muted-foreground">Verified Agencies</p>
                    </div>
                  </CardContent>
                </Card>
                
                {hasChildLocations && (
                  <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                        <Globe className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{childLocations.length}</p>
                        <p className="text-sm text-muted-foreground">{getChildTypeName()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                  <Link to="/agencies">
                    <Building2 className="w-5 h-5 mr-2" />
                    Browse Agencies
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-background/50 backdrop-blur-sm">
                  <a href="#enquire">
                    <Heart className="w-5 h-5 mr-2" />
                    Start Enquiry
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Child Locations Grid - Modern Cards */}
        {hasChildLocations && (
          <section className="section-padding bg-background relative">
            <div className="container-main">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Explore {location.name}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{getChildTypeName()} in {location.name}</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Find foster care agencies in specific areas of {location.name}. Click on a {getChildTypeName().toLowerCase().slice(0, -1)} to view local agencies.
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                whileInView="visible"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {childLocations.map((childLoc, index) => (
                  <motion.div key={childLoc.id} variants={itemVariants}>
                    <Link to={getChildLocationUrl(childLoc)}>
                      <Card className="group h-full border-border/50 hover:border-primary/30 hover:shadow-card bg-gradient-to-br from-background to-background-warm transition-all duration-300">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{childLoc.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs bg-muted/50 border-0">
                                  {childLoc.agency_count || 0} agencies
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Why Fostering Section - Always show with defaults or CMS content */}
        <section className="section-padding bg-gradient-to-b from-background-warm to-background relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -translate-y-1/2" />
          </div>
          
          <div className="container-main relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Heart className="w-3.5 h-3.5 mr-1.5" />
                Why Foster?
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {whyFosteringContent?.title || `Why Fostering Matters in ${location.name}`}
              </h2>
              <p className="text-foreground-muted text-lg leading-relaxed">
                {whyFosteringContent?.content || `Every child deserves a safe, loving home. Foster carers in ${location.name} provide vital support to children who need it most, offering stability during challenging times. Whether you're considering short-term fostering or a long-term commitment, your care can transform a young person's life.`}
              </p>
            </motion.div>

            {/* Trust points */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { icon: Shield, title: "Verified Agencies", desc: "All agencies are checked and verified", color: "from-emerald-500/20 to-emerald-500/5" },
                { icon: Heart, title: "Child-Focused", desc: "Every decision puts children first", color: "from-rose-500/20 to-rose-500/5" },
                { icon: Users, title: "Expert Support", desc: "24/7 professional guidance", color: "from-blue-500/20 to-blue-500/5" },
                { icon: Award, title: "Quality Standards", desc: "Ofsted-rated agency partners", color: "from-amber-500/20 to-amber-500/5" },
              ].map((item, index) => (
                <motion.div key={item.title} variants={itemVariants}>
                  <Card className="h-full border-0 bg-background shadow-card hover:shadow-elevated transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Agency Types Section */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  Agency Types
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {agencyTypesContent?.title || "Independent vs Local Authority Fostering"}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {agencyTypesContent?.subtitle || "Understanding your options helps you find the right fit"}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-7">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Independent Fostering Agencies</h3>
                          <p className="text-sm text-muted-foreground">Private sector providers</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {[
                          "24/7 dedicated support line",
                          "Specialist placements & therapeutic training",
                          "Close-knit carer communities",
                          "Regular supervision & home visits",
                          "Competitive fostering allowances",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="h-full border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                    <CardContent className="p-7">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                          <Users className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Local Authority Fostering</h3>
                          <p className="text-sm text-muted-foreground">Council-run services</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {[
                          "Placements closer to child's home area",
                          "Direct involvement with children's services",
                          "Ties into local schools & community",
                          "Council-led support systems",
                          "Access to local resources",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Types of Fostering */}
        <section className="section-padding bg-background-warm">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Fostering Types
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {fosteringTypesContent?.title || `Types of Fostering in ${location.name}`}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {fosteringTypesContent?.subtitle || "Discover the different ways you can make a difference in a child's life"}
                </p>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {[
                  { icon: Clock, title: "Short-Term Fostering", desc: "Temporary care during transitions, from a few days to several months." },
                  { icon: Heart, title: "Long-Term Fostering", desc: "A stable, permanent home for a child until they reach adulthood." },
                  { icon: Shield, title: "Emergency Fostering", desc: "Immediate placement for children in crisis situations." },
                  { icon: Users, title: "Respite Fostering", desc: "Short breaks to support other foster families." },
                  { icon: GraduationCap, title: "Parent and Child", desc: "Supporting young parents to care for their babies." },
                  { icon: Award, title: "Specialist Fostering", desc: "Care for children with additional or complex needs." },
                ].map((type, index) => (
                  <motion.div key={type.title} variants={itemVariants}>
                    <Card className="h-full hover:shadow-card transition-shadow border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <type.icon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold">{type.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Agencies Section */}
        {agencies && agencies.length > 0 && (
          <section className="section-padding bg-background">
            <div className="container-main">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {isShowingFeatured ? "Featured Agencies" : "Local Agencies"}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {isShowingFeatured ? "Featured Fostering Agencies" : `Agencies in ${location.name}`}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {isShowingFeatured ? "Explore our featured fostering agencies across the UK." : `Browse verified agencies serving ${location.name} and surrounding areas.`}
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {agencies.map((agency) => (
                  <motion.div key={agency.id} variants={itemVariants}>
                    <Link to={`/agencies/${agency.slug}`}>
                      <Card className="group h-full hover:shadow-card hover:border-primary/20 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            {agency.logo_url ? (
                              <img src={agency.logo_url} alt={agency.name} className="w-14 h-14 rounded-xl object-cover" />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                                <Building2 className="w-7 h-7 text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">{agency.name}</h3>
                              {agency.city && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                  <MapPin className="w-3.5 h-3.5" />{agency.city}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {agency.rating && agency.rating > 0 && (
                                <div className="flex items-center gap-1 text-sm bg-amber-500/10 px-2.5 py-1 rounded-full">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  <span className="font-medium text-amber-700">{agency.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {agency.is_verified && (
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mt-10"
              >
                <Button variant="outline" size="lg" asChild>
                  <Link to="/agencies" className="group">
                    View All Agencies
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Lead Form Section */}
        <section className="section-padding bg-gradient-to-b from-background-sand to-background-warm" id="enquire">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  Get in Touch
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Fostering Journey in {location.name}</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Ready to learn more? Fill out our enquiry form and a friendly fostering advisor will call you back within 24 hours. No pressure, just helpful guidance.
                </p>
                
                <div className="space-y-5">
                  {[
                    { icon: CheckCircle, title: "No obligation", desc: "Get free information with no commitment required" },
                    { icon: Phone, title: "Quick response", desc: "We'll call you back within 24 hours" },
                    { icon: Shield, title: "100% confidential", desc: "Your information is kept completely private" },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.title} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <MultiStepLeadForm sourceType="location_page" sourceLocationId={location.id} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container-main text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform a Child's Life?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Take the first step today. Connect with fostering agencies in {location.name} and discover how you can make a difference.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild className="shadow-lg">
                  <Link to="/agencies">
                    <Building2 className="w-5 h-5 mr-2" />
                    Find Local Agencies
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href="#enquire" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Make an Enquiry
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        {allFaqs && allFaqs.length > 0 && (
          <FaqSection 
            faqs={allFaqs} 
            title={`Fostering in ${location.name}: FAQs`}
            subtitle={`Common questions about foster care in ${location.name}`}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

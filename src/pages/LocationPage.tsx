import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Building2, Users, Heart, Shield, Phone, CheckCircle, Star, ExternalLink, Award, GraduationCap, Clock, ArrowRight, Sparkles, Globe, Calendar, Eye } from "lucide-react";
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
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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
  const { data: locationAgencies } = useAgenciesByLocation(location?.id, 12);
  const { data: featuredAgencies } = useFeaturedAgencies(12);
  
  // Build CMS page_key with location_ prefix
  const cmsPageKey = slug ? `location_${slug}` : undefined;
  
  // Fetch CMS content and FAQs by page_key
  const { data: cmsContent } = useCmsContentByPage(cmsPageKey);
  const { data: pageFaqs } = useFaqsByPage(cmsPageKey);

  const isLoading = locationLoading || childrenLoading;

  // Get specific content sections
  const heroContent = getContentBySection(cmsContent, 'hero');
  const whyFosteringContent = getContentBySection(cmsContent, 'why_fostering');

  // Combine FAQs from location and page
  const allFaqs = [...(locationFaqs || []), ...(pageFaqs || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-20">
          <section className="relative py-16 md:py-24 bg-slate-950">
            <div className="container-main">
              <Skeleton className="h-6 w-64 mb-6 bg-slate-800" />
              <Skeleton className="h-14 w-96 mb-4 bg-slate-800" />
              <Skeleton className="h-6 w-full max-w-2xl bg-slate-800" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold mb-3 text-white">Location Not Found</h1>
            <p className="text-slate-400 mb-8">The location you're looking for doesn't exist or may have been moved.</p>
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
        {/* HERO SECTION - Dark, Bold, Directory Feel */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[150px]" />
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />

          <div className="container-main relative z-10">
            {/* Breadcrumb */}
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap"
            >
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/locations" className="hover:text-white transition-colors">Locations</Link>
              {locationPath && locationPath.slice(0, -1).map((loc, index) => (
                <span key={loc.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  <Link to={buildLocationUrl(locationPath.slice(0, index + 1))} className="hover:text-white transition-colors">
                    {loc.name}
                  </Link>
                </span>
              ))}
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{location.name}</span>
            </motion.nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Hero Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-5">
                  {flag && <span className="text-3xl">{flag}</span>}
                  <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 text-sm font-medium capitalize">
                    {location.type} Directory
                  </Badge>
                  {totalAgencies > 0 && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5 text-sm">
                      {totalAgencies} Agencies
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] mb-5">
                  {heroContent?.title || <>Fostering Agencies in <span className="text-primary">{location.name}</span></>}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed mb-8">
                  {heroContent?.content || location.description || `Discover verified foster care agencies across ${location.name}. Compare services, read reviews, and find the right agency for your fostering journey.`}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 px-8" asChild>
                    <a href="#agencies">
                      <Building2 className="w-5 h-5 mr-2" />
                      Browse Agencies
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500 px-8" asChild>
                    <a href="#enquire">
                      <Heart className="w-5 h-5 mr-2" />
                      Start Enquiry
                    </a>
                  </Button>
                </div>
              </motion.div>

              {/* Right - Stats Grid */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Building2, value: totalAgencies.toString(), label: "Verified Agencies", color: "from-primary/20 to-emerald-600/10" },
                  { icon: Star, value: "4.8", label: "Average Rating", color: "from-amber-500/20 to-orange-500/10" },
                  { icon: Users, value: "500+", label: "Foster Carers", color: "from-blue-500/20 to-indigo-500/10" },
                  { icon: Shield, value: "100%", label: "Ofsted Registered", color: "from-violet-500/20 to-purple-500/10" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/10 rounded-2xl p-5`}
                  >
                    <stat.icon className="w-6 h-6 text-white/70 mb-3" />
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* AGENCY LISTINGS - Horizontal Row Format */}
        <section className="py-12 md:py-16 bg-slate-900" id="agencies">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {isShowingFeatured ? "Featured Agencies" : `Agencies in ${location.name}`}
                </h2>
                <p className="text-slate-400">
                  {isShowingFeatured ? "Top-rated fostering agencies across England" : `${agencies?.length || 0} agencies serving ${location.name}`}
                </p>
              </div>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                <Link to="/agencies">View All</Link>
              </Button>
            </motion.div>

            {/* Agency Rows */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {agencies?.map((agency, index) => (
                <motion.div 
                  key={agency.id} 
                  variants={itemVariants}
                  className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Agency Logo/Image */}
                    <div className="flex-shrink-0">
                      {agency.logo_url ? (
                        <img 
                          src={agency.logo_url} 
                          alt={agency.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-600"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20">
                          <Building2 className="w-7 h-7 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Agency Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors truncate">
                          {agency.name}
                        </h3>
                        {agency.is_verified && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {agency.is_featured && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        {agency.city && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {agency.city}
                          </span>
                        )}
                        {agency.description && (
                          <span className="hidden md:block truncate max-w-md">
                            {agency.description.slice(0, 80)}...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="hidden sm:flex items-center gap-3 px-4 border-l border-slate-700">
                      {agency.rating && agency.rating > 0 ? (
                        <div className="text-center">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-white">{agency.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {agency.review_count || 0} reviews
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-slate-500">No reviews</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hidden sm:flex"
                        asChild
                      >
                        <a href={`tel:${agency.phone || ''}`}>
                          <Calendar className="w-4 h-4 mr-1.5" />
                          Book
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary-hover"
                        asChild
                      >
                        <Link to={`/agencies/${agency.slug}`}>
                          <Eye className="w-4 h-4 mr-1.5" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800" asChild>
                <Link to="/agencies">
                  View All Agencies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Child Locations - Compact Grid */}
        {hasChildLocations && (
          <section className="py-12 md:py-16 bg-slate-950">
            <div className="container-main">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {getChildTypeName()} in {location.name}
                </h2>
                <p className="text-slate-400">
                  Explore fostering agencies in specific areas
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
              >
                {childLocations.map((childLoc) => (
                  <motion.div key={childLoc.id} variants={itemVariants}>
                    <Link to={getChildLocationUrl(childLoc)}>
                      <div className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-primary/40 rounded-xl p-4 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm mb-1 truncate">
                          {childLoc.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {childLoc.agency_count || 0} agencies
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Why Fostering Matters - Compact */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-10"
            >
              <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 mb-4">
                <Heart className="w-3.5 h-3.5 mr-1.5" />
                Why Foster?
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {whyFosteringContent?.title || `Why Fostering Matters in ${location.name}`}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {whyFosteringContent?.content || `Every child deserves a safe, loving home. Foster carers in ${location.name} provide vital support to children who need it most.`}
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { icon: Shield, title: "Verified Agencies", desc: "All agencies checked", color: "from-emerald-500/20" },
                { icon: Heart, title: "Child-Focused", desc: "Children come first", color: "from-rose-500/20" },
                { icon: Users, title: "24/7 Support", desc: "Always available", color: "from-blue-500/20" },
                { icon: Award, title: "Ofsted Rated", desc: "Quality assured", color: "from-amber-500/20" },
              ].map((item, index) => (
                <motion.div key={item.title} variants={itemVariants}>
                  <div className={`bg-gradient-to-br ${item.color} to-transparent border border-slate-800 rounded-xl p-5`}>
                    <item.icon className="w-6 h-6 text-white/70 mb-3" />
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Types of Fostering - Compact Pills */}
        <section className="py-12 md:py-16 bg-slate-950">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Types of Fostering
              </h2>
              <p className="text-slate-400">Different ways to make a difference</p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { icon: Clock, title: "Short-Term" },
                { icon: Heart, title: "Long-Term" },
                { icon: Shield, title: "Emergency" },
                { icon: Users, title: "Respite" },
                { icon: GraduationCap, title: "Parent & Child" },
                { icon: Award, title: "Specialist" },
              ].map((type) => (
                <motion.div key={type.title} variants={itemVariants}>
                  <Link to={`/specialisms/${type.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-primary/40 rounded-full px-5 py-2.5 transition-all">
                      <type.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{type.title}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Agency Types - Side by Side Compact */}
        <section className="py-12 md:py-16 bg-slate-900">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Agency Types Explained
              </h2>
              <p className="text-slate-400">Understanding your options</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-white">Independent Agencies</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  {["24/7 dedicated support", "Specialist training", "Competitive allowances"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">Local Authority</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  {["Local placements", "Council support", "Community ties"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Lead Form Section - Dark Theme */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-950 to-slate-900" id="enquire">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  Get in Touch
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Start Your Journey in {location.name}
                </h2>
                <p className="text-slate-400 text-lg mb-8">
                  Ready to learn more? Fill out our enquiry form and a fostering advisor will call you within 24 hours.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, title: "No obligation", desc: "Free information, no commitment" },
                    { icon: Phone, title: "Quick response", desc: "Callback within 24 hours" },
                    { icon: Shield, title: "Confidential", desc: "Your data is secure" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8"
              >
                <MultiStepLeadForm sourceType={`location_${location.slug}`} sourceLocationId={location.id} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {allFaqs && allFaqs.length > 0 && (
          <section className="py-12 md:py-16 bg-slate-950">
            <div className="container-main">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-400">Common questions about fostering in {location.name}</p>
              </motion.div>
              
              <div className="max-w-3xl mx-auto">
                <FaqSection faqs={allFaqs} />
              </div>
            </div>
          </section>
        )}

        {/* CTA Section - Compact */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary/20 via-slate-900 to-emerald-600/20">
          <div className="container-main">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Transform a Child's Life?
              </h2>
              <p className="text-slate-400 mb-8">
                Join hundreds of foster carers in {location.name} making a real difference.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25" asChild>
                  <a href="#enquire">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800" asChild>
                  <Link to="/guides/how-to-become-foster-carer">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

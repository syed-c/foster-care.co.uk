import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight, Globe } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { useCmsContentSection } from "@/hooks/useCmsContent";

const ukRegionsFallback = [
  { name: "England", agencies: 320, slug: "england" },
  { name: "Scotland", agencies: 85, slug: "scotland" },
  { name: "Wales", agencies: 45, slug: "wales" },
  { name: "Northern Ireland", agencies: 35, slug: "northern-ireland" },
];

const popularRegions = [
  { name: "London", count: 78, slug: "london" },
  { name: "South East", count: 62, slug: "south-east" },
  { name: "North West", count: 54, slug: "north-west" },
  { name: "West Midlands", count: 48, slug: "west-midlands" },
  { name: "Yorkshire", count: 42, slug: "yorkshire" },
  { name: "East Midlands", count: 38, slug: "east-midlands" },
  { name: "South West", count: 36, slug: "south-west" },
  { name: "North East", count: 28, slug: "north-east" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LocationDiscoverySection() {
  const { data: locations } = useLocations();
  const { data: locationContent } = useCmsContentSection("home", "locations");
  
  const countries = locations?.filter(l => l.type === 'country') || [];
  const ukRegions = countries.length > 0 
    ? countries.map(c => ({ name: c.name, agencies: c.agency_count || 0, slug: c.slug }))
    : ukRegionsFallback;

  const title = locationContent?.title || "Find Agencies Near You";
  const subtitle = locationContent?.subtitle || "Browse by Location";
  const content = locationContent?.content || "Explore foster care agencies across the United Kingdom. Select a country or region to find local support.";

  return (
    <section className="section-padding bg-background-warm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-4">
            <Globe className="w-4 h-4" />
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            {content}
          </p>
        </motion.div>

        {/* UK Countries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {ukRegions.map((region, index) => (
            <motion.div key={region.name} variants={itemVariants}>
              <Link
                to={`/locations/${region.slug}`}
                className="flex items-center justify-between p-5 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">{region.agencies} agencies</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Popular Regions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold mb-6">Popular Regions in England</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularRegions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/locations/england/${region.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{region.name}</span>
                  <span className="text-sm text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                    {region.count}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Heart, Users, Shield, Target } from "lucide-react";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { useCmsContentByPage, getContentBySection } from "@/hooks/useCmsContent";
import { useFaqs } from "@/hooks/useFaqs";
import { FaqSection } from "@/components/shared/FaqSection";
import { Skeleton } from "@/components/ui/skeleton";

const valueIcons = [Heart, Users, Shield, Target];
const defaultValues = [
  { title: "Child-Centred", description: "Every decision we make puts the welfare and wellbeing of children at the heart of our work." },
  { title: "Supportive Community", description: "We believe in building strong connections between agencies, carers, and families." },
  { title: "Trust & Transparency", description: "We verify all agencies and provide honest, unbiased information to help you make informed decisions." },
  { title: "Accessibility", description: "Making it easier for everyone to find the right foster care support, wherever they are in the UK." },
];

export default function AboutPage() {
  const { data: cmsContent, isLoading: cmsLoading } = useCmsContentByPage("about");
  const { data: faqs, isLoading: faqsLoading } = useFaqs("about");

  const heroContent = getContentBySection(cmsContent, "hero");
  const missionContent = getContentBySection(cmsContent, "mission");
  const valuesContent = getContentBySection(cmsContent, "values");
  const statsContent = getContentBySection(cmsContent, "stats");

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="About Us - Foster Care UK"
        description="Learn about Foster Care UK, the UK's leading directory for foster care agencies. Our mission is to connect families with trusted care."
        canonicalUrl="https://fostercare.uk/about"
        keywords={["about foster care uk", "foster care mission", "fostering support", "UK foster agencies"]}
        structuredData={getBreadcrumbSchema([
          { name: "Home", url: "https://fostercare.uk" },
          { name: "About", url: "https://fostercare.uk/about" },
        ])}
      />
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-background-warm py-16 md:py-24">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              {cmsLoading ? (
                <>
                  <Skeleton className="h-6 w-24 mb-6" />
                  <Skeleton className="h-16 w-full mb-6" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : (
                <>
                  <span className="badge-pill mb-6 inline-block">
                    {heroContent?.subtitle || "About Us"}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
                    {heroContent?.title?.split(" ").slice(0, 3).join(" ") || "Connecting Families with"}
                    <br />
                    <span className="text-primary">
                      {heroContent?.title?.split(" ").slice(3).join(" ") || "Trusted Care"}
                    </span>
                  </h1>
                  <p className="text-foreground-muted text-xl leading-relaxed">
                    {heroContent?.content || 
                      "Foster Care UK is the leading directory for foster care agencies across the United Kingdom. We're here to make it easier for prospective foster carers to find the right agency, and for agencies to connect with families who want to make a difference."}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {cmsLoading ? (
                  <>
                    <Skeleton className="h-10 w-48 mb-6" />
                    <Skeleton className="h-20 w-full mb-6" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                      {missionContent?.title || "Our Mission"}
                    </h2>
                    <p className="text-foreground-muted text-lg mb-6 leading-relaxed">
                      {missionContent?.content?.split(". ").slice(0, 2).join(". ") + "." || 
                        "There are over 80,000 children in care in the UK, and thousands more foster carers are needed every year. We believe that finding the right foster care agency shouldn't be complicated."}
                    </p>
                    <p className="text-foreground-muted text-lg leading-relaxed">
                      {missionContent?.content?.split(". ").slice(2).join(". ") || 
                        "Our mission is to simplify the journey for prospective foster carers by providing a comprehensive, trustworthy directory of verified agencies. We want every child to have the opportunity to find a loving, supportive home."}
                    </p>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                <div className="rounded-2xl bg-[#1a2228] text-center p-6 text-white hover:bg-card hover:text-foreground transition-colors duration-300">
                  <p className="text-4xl font-bold text-primary mb-2">500+</p>
                  <p className="text-white/60">Verified Agencies</p>
                </div>
                <div className="rounded-2xl bg-[#1a2228] text-center p-6 text-white hover:bg-card hover:text-foreground transition-colors duration-300">
                  <p className="text-4xl font-bold text-primary mb-2">4</p>
                  <p className="text-white/60">UK Nations</p>
                </div>
                <div className="rounded-2xl bg-[#1a2228] text-center p-6 text-white hover:bg-card hover:text-foreground transition-colors duration-300">
                  <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                  <p className="text-white/60">Families Helped</p>
                </div>
                <div className="rounded-2xl bg-[#1a2228] text-center p-6 text-white hover:bg-card hover:text-foreground transition-colors duration-300">
                  <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                  <p className="text-white/60">Support Available</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-background-sand">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                {valuesContent?.title || "Our Values"}
              </h2>
              <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                {valuesContent?.subtitle || "Everything we do is guided by our commitment to children, families, and the fostering community."}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultValues.map((value, index) => {
                const Icon = valueIcons[index];
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-2xl bg-[#1a2228] text-center text-white hover:bg-card hover:text-foreground transition-colors duration-300 p-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-white/80">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <FaqSection 
            faqs={faqs} 
            title="Frequently Asked Questions"
            subtitle="Common questions about Foster Care UK"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SEOHead, getBreadcrumbSchema } from "@/components/seo/SEOHead";
import { useCmsContentByPage, getContentBySection } from "@/hooks/useCmsContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: cmsContent, isLoading } = useCmsContentByPage("contact");

  const heroContent = getContentBySection(cmsContent, "hero");
  const emailContent = getContentBySection(cmsContent, "email");
  const phoneContent = getContentBySection(cmsContent, "phone");
  const addressContent = getContentBySection(cmsContent, "address");
  const urgentContent = getContentBySection(cmsContent, "urgent");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Contact Us - Foster Care UK"
        description="Get in touch with Foster Care UK. We're here to help with any questions about foster care agencies or our directory."
        canonicalUrl="https://fostercare.uk/contact"
        keywords={["contact foster care uk", "fostering enquiries", "foster care support"]}
        structuredData={getBreadcrumbSchema([
          { name: "Home", url: "https://fostercare.uk" },
          { name: "Contact", url: "https://fostercare.uk/contact" },
        ])}
      />
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-background-warm py-12 md:py-16">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-24 mx-auto mb-4" />
                  <Skeleton className="h-12 w-64 mx-auto mb-4" />
                  <Skeleton className="h-6 w-96 mx-auto" />
                </>
              ) : (
                <>
                  <span className="badge-pill mb-4 inline-block">
                    {heroContent?.subtitle || "Contact Us"}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                    {heroContent?.title || "We're Here to Help"}
                  </h1>
                  <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
                    {heroContent?.content || "Have questions about foster care or our directory? Get in touch and our team will respond within 24 hours."}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section-padding bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {emailContent?.title || "Email Us"}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {emailContent?.subtitle || "For general enquiries"}
                      </p>
                      <a 
                        href={`mailto:${emailContent?.content || "hello@fostercare.uk"}`} 
                        className="text-primary hover:underline"
                      >
                        {emailContent?.content || "hello@fostercare.uk"}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {phoneContent?.title || "Call Us"}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {phoneContent?.subtitle || "Mon-Fri, 9am-5pm"}
                      </p>
                      <a 
                        href={`tel:${(phoneContent?.content || "0800 123 4567").replace(/\s/g, "")}`} 
                        className="text-primary hover:underline"
                      >
                        {phoneContent?.content || "0800 123 4567"}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        {addressContent?.title || "Location"}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {addressContent?.subtitle || "Our registered office"}
                      </p>
                      <p className="text-foreground">
                        {(addressContent?.content || "123 Foster Lane, London, EC1A 1BB").split(", ").map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground border-0">
                  <CardContent className="p-6">
                    <MessageCircle className="w-8 h-8 mb-3" />
                    <h3 className="font-semibold text-lg mb-2">
                      {urgentContent?.title || "Need Urgent Support?"}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm">
                      {urgentContent?.content || 
                        "If you're a foster carer in crisis or need immediate assistance, please contact your agency directly or call our emergency line."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <Input
                            id="name"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Phone Number (Optional)
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="07123 456789"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Subject
                          </label>
                          <Input
                            id="subject"
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Your Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={6}
                          className="rounded-xl resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <Send className="w-5 h-5" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
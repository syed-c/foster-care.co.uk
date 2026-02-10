import { motion } from "framer-motion";
import { Shield, Heart, Users, CheckCircle, Award, Clock } from "lucide-react";
import { useCmsContentSection } from "@/hooks/useCmsContent";
const trustPoints = [{
  icon: Shield,
  title: "Ofsted Verified Agencies",
  description: "Every agency in our directory is cross-referenced with Ofsted records to ensure they meet regulatory standards for foster care in England.",
  gradient: "from-emerald-500/10 to-emerald-500/5"
}, {
  icon: Heart,
  title: "Child-Centred Approach",
  description: "Our platform prioritises children's welfare above all else. We only feature agencies committed to providing safe, nurturing placements.",
  gradient: "from-rose-500/10 to-rose-500/5"
}, {
  icon: Users,
  title: "Expert Fostering Support",
  description: "Access agencies offering 24/7 support, comprehensive training, and dedicated social workers to guide you through your fostering journey.",
  gradient: "from-blue-500/10 to-blue-500/5"
}, {
  icon: CheckCircle,
  title: "Transparent Reviews",
  description: "Read genuine reviews from foster carers. We verify feedback to ensure authentic experiences help you make informed decisions.",
  gradient: "from-amber-500/10 to-amber-500/5"
}];
const stats = [{
  icon: Award,
  value: "500+",
  label: "Registered Fostering Agencies"
}, {
  icon: Users,
  value: "10,000+",
  label: "Foster Families Connected"
}, {
  icon: Clock,
  value: "24/7",
  label: "Agency Support Available"
}];
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
export function TrustSection() {
  const {
    data: trustContent
  } = useCmsContentSection("home", "trust");
  const metadata = (trustContent as any)?.metadata as Record<string, string> | null;
  const title = (trustContent as any)?.title;
  const subtitle = metadata?.subtitle;
  const content = (trustContent as any)?.content;

  if (!trustContent) return null;

  return <section className="section-padding bg-background relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-30 bg-foreground">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/50 rounded-full blur-3xl" />
    </div>

    <div className="container-main relative z-10">
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
        {subtitle && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-4">
            <Shield className="w-4 h-4" />
            {subtitle}
          </span>
        )}
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
        )}
        {content && (
          <p className="text-foreground-muted max-w-2xl mx-auto text-base">
            {content}
          </p>
        )}
      </motion.div>

      {/* Trust Points Grid */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {trustPoints.map((point, index) => <motion.div key={point.title} variants={itemVariants} className="group relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${point.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative card-warm group-hover:border-primary/20 transition-all duration-300 h-full shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <point.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{point.description}</p>
          </div>
        </motion.div>)}
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="bg-secondary rounded-3xl p-8 md:p-10 text-secondary-foreground">
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: index * 0.1
          }} className="flex items-center gap-4 justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground text-white">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>)}
        </div>
      </motion.div>
    </div>
  </section>;
}
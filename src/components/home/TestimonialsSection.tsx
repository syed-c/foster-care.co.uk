import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCmsContentSection } from "@/hooks/useCmsContent";
interface Testimonial {
  id: number;
  name: string;
  location: string;
  years: string;
  quote: string;
  rating: number;
  image?: string;
}
const testimonials: Testimonial[] = [{
  id: 1,
  name: "Sarah Thompson",
  location: "Birmingham",
  years: "Foster carer for 8 years",
  quote: "Fostering has been the most rewarding journey of my life. Watching children grow, heal, and thrive in our home has given our family so much purpose. The support from our agency has been incredible - they're always just a phone call away.",
  rating: 5
}, {
  id: 2,
  name: "Michael & Emma Roberts",
  location: "Manchester",
  years: "Foster carers for 5 years",
  quote: "We were nervous at first, but the training prepared us for everything. We've fostered 12 children now, and each one has left a lasting impact on our hearts. The best decision we ever made was becoming foster carers.",
  rating: 5
}, {
  id: 3,
  name: "David Chen",
  location: "London",
  years: "Foster carer for 3 years",
  quote: "As a single foster carer, I wasn't sure if I could do this alone. But with the support network and training, I've been able to provide a stable home for teenagers. Seeing their confidence grow is priceless.",
  rating: 5
}, {
  id: 4,
  name: "Patricia Williams",
  location: "Leeds",
  years: "Foster carer for 12 years",
  quote: "Our biological children have grown up with foster siblings and it's made them more compassionate and understanding. Fostering isn't just about the child you care for - it enriches your whole family.",
  rating: 5
}, {
  id: 5,
  name: "James & Helen Moore",
  location: "Bristol",
  years: "Foster carers for 6 years",
  quote: "We started fostering after our own children left home. Now we can't imagine life without the little ones running around. Every goodbye is hard, but knowing you've made a difference makes it worthwhile.",
  rating: 5
}];
export const TestimonialsSection = () => {
  const {
    data: testimonialsContent
  } = useCmsContentSection("home", "testimonials");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const metadata = testimonialsContent?.metadata as Record<string, string> | null;
  const title = testimonialsContent?.title || "Hear From Our Foster Families";
  const subtitle = metadata?.subtitle || "Foster Carer Stories";
  const content = testimonialsContent?.content || "Real stories from foster carers across the UK sharing their experiences and the joy that fostering brings";
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000);
    return () => clearInterval(timer);
  }, []);
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };
  return <section className="py-20 lg:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
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
      }} className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title.includes("Foster Families") ? <>Hear From Our <span className="text-primary">Foster Families</span></> : title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            {content}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={currentIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}>
                <Card className="p-8 md:p-12 bg-[#1a2228] text-white backdrop-blur-sm border-border/50 shadow-xl relative hover:scale-105 transition-transform duration-300">
                  <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/20" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-6 justify-center">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                    </div>

                    <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-8 text-center italic">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-bold mb-4">
                        {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="font-semibold text-white text-lg">
                        {testimonials[currentIndex].name}
                      </p>
                      <p className="text-white/60">
                        {testimonials[currentIndex].location}
                      </p>
                      <p className="text-sm text-primary font-medium mt-1">
                        {testimonials[currentIndex].years}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <Button variant="secondary" size="icon" onClick={prevTestimonial} className="pointer-events-auto -ml-4 md:-ml-6 h-12 w-12 rounded-full bg-[#1a2228] text-white shadow-lg hover:scale-105 transition-transform duration-300">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="secondary" size="icon" onClick={nextTestimonial} className="pointer-events-auto -mr-4 md:-mr-6 h-12 w-12 rounded-full bg-[#1a2228] text-white shadow-lg hover:scale-105 transition-transform duration-300">
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => <button key={index} onClick={() => {
            setDirection(index > currentIndex ? 1 : -1);
            setCurrentIndex(index);
          }} className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />)}
          </div>
        </div>

        {/* Stats Row */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[{
          value: "4.9/5",
          label: "Average Rating"
        }, {
          value: "500+",
          label: "Happy Foster Families"
        }, {
          value: "98%",
          label: "Would Recommend"
        }, {
          value: "10+",
          label: "Years Experience"
        }].map((stat, index) => <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>)}
        </motion.div>
      </div>
    </section>;
};
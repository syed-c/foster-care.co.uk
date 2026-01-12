import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
interface IntroSectionProps {
  heading?: string;
  paragraphs?: string[];
}
export const IntroSection = ({
  heading,
  paragraphs
}: IntroSectionProps) => {
  if (!paragraphs || paragraphs.length === 0) return null;
  return <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-foreground-muted">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center">
            {heading && <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-background">
                {heading}
              </h2>}
            <div className="space-y-5">
              {paragraphs.map((paragraph, index) => <motion.p key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: 0.1 * index
            }} className="text-background leading-relaxed text-base sm:text-lg max-w-3xl mx-auto">
                  {paragraph}
                </motion.p>)}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>;
};
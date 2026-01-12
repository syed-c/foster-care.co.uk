import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  heading?: string;
  paragraph?: string;
  button_text?: string;
}

export const CTASection = ({ 
  heading, 
  paragraph, 
  button_text 
}: CTASectionProps) => {
  if (!heading && !paragraph) return null;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-3xl p-12 md:p-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          {heading || "Start Exploring Fostering Agencies in England"}
        </h2>
        <p className="text-white/90 text-xl mb-8 max-w-[720px] mx-auto">
          {paragraph || "Connect with verified agencies that can support your fostering journey"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/agencies">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-white group bg-white text-green-900 hover:bg-gray-100"
            >
              {button_text || "Browse Agencies"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
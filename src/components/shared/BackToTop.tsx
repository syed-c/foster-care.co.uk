import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
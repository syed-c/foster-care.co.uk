import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export const CountryPageSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="h-16 bg-background border-b border-border/40" />
      
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[90svh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafa] via-[#f0f7f7] to-background z-0" />
        
        <div className="container-main relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* Badge Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-10"
          >
            <Skeleton className="h-10 w-64 rounded-full" />
          </motion.div>

          {/* Title Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            <Skeleton className="h-12 md:h-16 w-[80%] max-w-2xl rounded-lg" />
            <Skeleton className="h-12 md:h-16 w-[60%] max-w-xl rounded-lg" />
          </motion.div>

          {/* Rotating text skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex justify-center gap-2 mb-8"
          >
            <Skeleton className="h-8 w-32 rounded" />
            <Skeleton className="h-8 w-48 rounded" />
          </motion.div>

          {/* Description Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col items-center gap-2 mb-12"
          >
            <Skeleton className="h-5 w-[90%] max-w-xl rounded" />
            <Skeleton className="h-5 w-[70%] max-w-md rounded" />
          </motion.div>

          {/* Buttons Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="flex justify-center gap-4 mb-16"
          >
            <Skeleton className="h-14 w-40 rounded-xl" />
            <Skeleton className="h-14 w-36 rounded-xl" />
          </motion.div>

          {/* Stats Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background/80 rounded-2xl p-4 border border-border/40">
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trust Badges Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="mt-12"
          >
            <Skeleton className="h-4 w-48 mx-auto mb-6 rounded" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-32 rounded-xl" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Skeletons */}
      <div className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-8 rounded-lg" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
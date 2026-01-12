import { motion } from "framer-motion";
import { Building2, Users, CheckCircle } from "lucide-react";

export const AgencyTypesCompactSection = () => {
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-secondary/95 to-secondary">
      <div className="container-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Agency Types Explained
          </h2>
          <p className="text-white/60 text-lg">Understanding your options</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Independent Agencies</h3>
            </div>
            <ul className="space-y-3 text-sm">
              {["24/7 dedicated support line", "Specialist training programmes", "Competitive weekly allowances"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/70">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-trust/20 to-trust/5 border border-trust/30 rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-trust/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-trust" />
              </div>
              <h3 className="font-extrabold text-xl text-white">Local Authority</h3>
            </div>
            <ul className="space-y-3 text-sm">
              {["Local placements priority", "Council support network", "Strong community ties"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/70">
                  <CheckCircle className="w-4 h-4 text-trust flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

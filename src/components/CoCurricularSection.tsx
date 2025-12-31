import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useCoCurricular } from "@/hooks/usePortfolioData";
import { CoCurricularFloatingIcons, SectionDecorativeElements } from "./SectionFloatingIcons";

const CoCurricularSection = () => {
  const { data: activities, isLoading } = useCoCurricular();

  if (isLoading) {
    return (
      <section id="co-curricular" className="section-padding relative">
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="animate-pulse">Loading activities...</div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <section id="co-curricular" className="section-padding relative overflow-hidden">
      <CoCurricularFloatingIcons />
      <SectionDecorativeElements variant="circles" />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-emerald-400/20 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #14b8a6, #06b6d4, #10b981)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Co-Curricular Activities
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Leadership roles, club memberships, and extracurricular involvement that shaped my journey.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity: any, index: number) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{ y: -12, scale: 1.05 }}
              className="group relative"
            >
              {/* Card Container with enhanced styling */}
              <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/40 rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-500 p-6 backdrop-blur-sm min-h-[280px] flex flex-col">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Glow Border Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-xl -z-10" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-between">
                  {/* Club Logo with enhanced styling */}
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.15 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    
                    {activity.club_logo_url ? (
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-border/50 group-hover:border-primary/50 transition-all duration-300 p-3 shadow-lg group-hover:shadow-xl">
                        <img
                          src={activity.club_logo_url}
                          alt={activity.club_name || "Club"}
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      </div>
                    ) : (
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border-2 border-border/50 flex items-center justify-center">
                        <Users className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </motion.div>

                  {/* Club Name with gradient */}
                  <div className="flex-1 flex flex-col justify-center w-full px-2 py-3">
                    <h3 className="text-base font-extrabold text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-purple-500 group-hover:to-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 break-words">
                      {activity.club_name || "Club"}
                    </h3>
                  </div>

                  {/* Role Badge with enhanced styling */}
                  <div className="w-full">
                    {activity.role && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 border-2 border-primary/30 group-hover:border-primary/50 shadow-md group-hover:shadow-lg transition-all duration-300"
                      >
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent break-words text-center">
                          {activity.role}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Animated Divider */}
                  <motion.div
                    className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-3"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.5, duration: 0.8 }}
                  />
                </div>

                {/* Corner Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-tl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full blur-2xl" />
                
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500" 
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          
        </motion.div>
      </div>
    </section>
  );
};

export default CoCurricularSection;

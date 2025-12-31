import React from "react";
import { motion } from "framer-motion";
import AnimatedTechLogos from "./AnimatedTechLogos"; 
import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "@/lib/api";
import { SkillCategory, Skill } from "@/types/skills"; // Adjust path as needed

const SkillsSection: React.FC = () => {
  // 1. Fetch data with Type Safety
  const { data: categories, isLoading } = useQuery<SkillCategory[]>({
    queryKey: ["skillCategories"],
    queryFn: skillsApi.getAll,
  });

  // 2. Filter Logic
  const mainCategories = categories?.filter(c => !["Highlights", "Other", "Tags"].includes(c.name)) || [];
  const highlightCategory = categories?.find(c => ["Highlights", "Other", "Tags"].includes(c.name));

  // 3. Extract skill names for animation (Type safe flatMap)
  const allSkillNames: string[] = categories?.flatMap(c => c.skills.map(s => s.name)) || [];

  if (isLoading) return <div className="py-20 text-center text-muted-foreground animate-pulse">Loading Skills...</div>;

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-background via-background to-primary/5 pointer-events-none" />
      
      {/* Minimal grid pattern - very subtle */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="skills-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary/40" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#skills-grid)" />
        </svg>
      </div>

      {/* Corner accent glows - positioned away from center solar system */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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
              Technical Skills
            </h2>
          </div>
        </motion.div>

        {/* Animated Tech Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <AnimatedTechLogos variant="orbital" skills={allSkillNames} />
        </motion.div>

        {/* Skills arranged in 2x2 grid on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {mainCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-gradient-to-br from-card via-card to-card/80 border border-primary/40 rounded-2xl p-4 md:p-5 lg:p-6 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300 overflow-hidden"
            >
              {/* Glowing border effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/20 via-cyan/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)] pointer-events-none" />
              
              {/* Category Title */}
              <h3 className="relative text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {category.logo_url ? (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-white border border-primary/30 p-2 flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <img 
                      src={category.logo_url} 
                      alt={category.name} 
                      className="w-full h-full object-contain drop-shadow-lg" 
                    />
                  </div>
                ) : (
                  <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:shadow-[0_0_12px_rgba(34,211,238,1)] transition-shadow" />
                )}
                <span className="truncate">{category.name}</span>
              </h3>

              <div className="relative space-y-4 md:space-y-6">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="group/skill">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm md:text-[15px] font-medium text-foreground/90 group-hover/skill:text-primary transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs md:text-sm font-bold text-primary">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden shadow-inner">
                      {/* Progress Bar Fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full relative group-hover/skill:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-shadow"
                        style={{
                          background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
                          boxShadow: "0 0 8px rgba(34, 211, 238, 0.3)"
                        }}
                      >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Tags */}
        {highlightCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <h4 className="text-sm font-medium text-gray-400 mb-6">Tools & Platforms</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {highlightCategory.skills.map((skill) => (
                <motion.span
                  key={skill.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full text-cyan-400 text-sm font-medium cursor-default hover:border-cyan-500/50 transition-colors"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
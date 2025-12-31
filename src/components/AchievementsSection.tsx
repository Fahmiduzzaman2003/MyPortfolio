import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink, X, Trophy, Shield } from "lucide-react";
import { useState } from "react";
import { AchievementFloatingIcons, SectionDecorativeElements } from "./SectionFloatingIcons";
import { useAchievements } from "@/hooks/usePortfolioData";

const AchievementsSection = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const { data: achievements, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <section id="achievements" className="section-padding bg-card/30 relative">
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="animate-pulse">Loading achievements...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="section-padding bg-card/30 relative">
      <AchievementFloatingIcons />
      <SectionDecorativeElements variant="dots" />
      
      <div className="container-custom relative z-10">
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
              Awards & Certificates
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recognition and certifications that highlight my journey and accomplishments in the tech industry.
          </p>
        </motion.div>

        {!achievements || achievements.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No achievements added yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement: any, index: number) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-primary/40 rounded-2xl overflow-hidden card-hover shadow-[0_0_15px_rgba(20,184,166,0.3)]"
            >
              {/* Image */}
              <div
                className="relative h-40 overflow-hidden cursor-pointer"
                onClick={() => setSelectedAchievement(achievement)}
              >
                {achievement.image_url ? (
                  <>
                    <img
                      src={achievement.image_url}
                      alt={achievement.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60">
                      <ExternalLink className="w-8 h-8 text-foreground" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Trophy className="w-4 h-4 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                    {achievement.title}
                  </h3>
                </div>
                
                {achievement.organization && (
                  <p className="text-sm text-primary mb-2">{achievement.organization}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {achievement.year}
                  </div>
                  {achievement.credential_url && (
                    <a
                      href={achievement.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Shield className="w-3 h-3" />
                      Verify
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Image Preview Modal */}
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedAchievement.title}</h3>
                  {selectedAchievement.organization && (
                    <p className="text-sm text-muted-foreground">{selectedAchievement.organization} • {selectedAchievement.year}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img
                src={selectedAchievement.image_url}
                alt="Certificate Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-border"
              />
              {selectedAchievement.credential_url && (
                <div className="mt-4 flex justify-center">
                  <a
                    href={selectedAchievement.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Shield className="w-5 h-5" />
                    Verify Credential
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;

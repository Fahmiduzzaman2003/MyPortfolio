import { motion } from "framer-motion";
import { Coffee, Lightbulb, Briefcase, Zap, BookOpen } from "lucide-react";
import { useCodingPlatforms, useProfile, useExperience } from "@/hooks/usePortfolioData";
import { CodingPlatformStats } from "./CodingPlatformsLogos";
import { AboutFloatingIcons } from "./SectionFloatingIcons";
import { useQuery } from "@tanstack/react-query";
import { codingStatsApi } from "@/lib/api";

const AboutSection = () => {
  const { data: profile } = useProfile();
  const { data: codingPlatforms = [] } = useCodingPlatforms();
  const { data: experiences = [] } = useExperience();
  
  // Fetch live coding stats
  const { data: liveStats } = useQuery({
    queryKey: ['coding-stats-live'],
    queryFn: codingStatsApi.getLiveStats,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Consider data stale after 4 minutes
  });

  // Fallback data when API isn't available
  const defaultPlatforms = [
    { id: '1', name: 'LeetCode', icon_name: 'leetcode', url: 'https://leetcode.com', problems_solved: 500, rating: '1800+', username: null },
    { id: '2', name: 'Codeforces', icon_name: 'codeforces', url: 'https://codeforces.com', problems_solved: 200, rating: '1500+', username: null },
    { id: '3', name: 'CodeChef', icon_name: 'codechef', url: 'https://codechef.com', problems_solved: 100, rating: '1700+', username: null },
  ];

  // Use live stats if available, otherwise use stored data
  const platformsToDisplay = liveStats && liveStats.length > 0 ? liveStats : 
                             (codingPlatforms.length > 0 ? codingPlatforms : defaultPlatforms);

  const highlights = [
    { icon: Zap, title: "Hard", subtitle: "Worker" },
    { icon: BookOpen, title: "Always", subtitle: "Learning" },
  ];

  return (
    <section id="about" className="py-16 md:py-20 relative">
      <AboutFloatingIcons />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            {/* Pulsing Halo */}
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
            {/* Static Title */}
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #14b8a6, #06b6d4, #10b981)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Turning Ideas Into Reality
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my journey, skills, and what drives my passion for technology.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card border border-primary/40 rounded-2xl p-8 card-hover shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                My Story
              </h3>
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                {profile?.bio ? (
                  <p className="whitespace-pre-line">{profile.bio}</p>
                ) : (
                  <>
                    <p>
                      I'm a passionate Computer Science student with a deep fascination for 
                      solving complex problems through elegant code. My journey in tech began 
                      with competitive programming, which taught me to think critically and 
                      optimize solutions efficiently.
                    </p>
                    <p>
                      Currently, I'm exploring the fascinating world of Machine Learning and 
                      AI, working on projects that bridge the gap between theoretical concepts 
                      and real-world applications. I believe in continuous learning and pushing 
                      the boundaries of what's possible.
                    </p>
                    <p>
                      When I'm not coding, you'll find me contributing to open-source projects, 
                      writing technical blogs, or participating in hackathons. I'm always excited 
                      to collaborate on innovative projects and learn from fellow developers.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Work Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Work Experience
                </h3>
              </div>
              {experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.slice(0, 3).map((exp: any, index: number) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="group relative bg-gradient-to-br from-card to-card/50 border border-primary/40 rounded-2xl p-5 hover:border-primary/60 transition-all duration-300 shadow-[0_0_10px_rgba(20,184,166,0.2)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      <div className="relative flex items-center gap-4">
                        {exp.company_logo_url && (
                          <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-primary/40 shadow-md shadow-primary/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
                            <img
                              src={exp.company_logo_url}
                              alt={exp.company_name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                            {exp.company_name}
                          </h4>
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            {exp.position}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <p className="text-xs text-muted-foreground/80 font-mono">
                              {exp.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-gradient-to-br from-card to-card/50 border border-dashed border-primary/40 rounded-2xl shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-primary/50" />
                  </div>
                  <p className="text-sm font-medium">No work experience added yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right - Highlights & Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-background border border-primary/40 rounded-2xl p-6 overflow-hidden group"
                >
                  {/* Neon Glow Effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.15), transparent 70%)',
                    }}
                  />
                  
                  {/* Top Border Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Icon with Shine Effect */}
                  <div className="relative mb-4 inline-block">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 via-cyan-500/30 to-primary/30 rounded-full blur-md"
                    />
                    <item.icon className="w-12 h-12 text-primary relative z-10 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  </div>
                  
                  {/* Text with Better Typography */}
                  <div className="relative z-10">
                    <div className="text-3xl font-black tracking-tight mb-1">
                      <span className="bg-gradient-to-r from-white via-teal-200 to-white bg-clip-text text-transparent">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-teal-400/90 tracking-wide uppercase">
                      {item.subtitle}
                    </div>
                  </div>
                  
                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Code Block */}
            <div className="bg-card border border-primary/40 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-primary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">about.js</span>
              </div>
              
              {/* Code Content */}
              <div className="p-6 font-mono text-sm">
                <div className="space-y-1">
                  <p><span className="text-primary">const</span> <span className="text-foreground">developer</span> = {"{"}</p>
                  <p className="pl-4"><span className="text-muted-foreground">name:</span> <span className="text-green-400">"{profile?.full_name || 'Your Name'}"</span>,</p>
                  <p className="pl-4"><span className="text-muted-foreground">role:</span> <span className="text-green-400">"{profile?.tagline || 'Full Stack Developer'}"</span>,</p>
                  <p className="pl-4"><span className="text-muted-foreground">passion:</span> <span className="text-green-400">"Building impactful solutions"</span>,</p>
                  <p className="pl-4"><span className="text-muted-foreground">skills:</span> [<span className="text-yellow-400">"React"</span>, <span className="text-yellow-400">"Python"</span>, <span className="text-yellow-400">"ML"</span>],</p>
                  <p className="pl-4"><span className="text-muted-foreground">learning:</span> <span className="text-green-400">"Always"</span>,</p>
                  <p className="pl-4"><span className="text-muted-foreground">coffee:</span> <span className="text-primary">true</span></p>
                  <p>{"}"};</p>
                </div>
              </div>
            </div>

            {/* Competitive Coding Stats */}
            <CodingPlatformStats platforms={platformsToDisplay} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

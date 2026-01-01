import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Mail, ChevronDown, Code2, Cpu, Database, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/usePortfolioData";

const defaultRoles = [
  "Computer Science Student",
  "Competitive Programmer",
  "Machine Learning Enthusiast",
  "Full Stack Developer",
  "Research Aspirant",
];

const HeroSection = () => {
  const { data: profile, isLoading } = useProfile();
  const [currentRole, setCurrentRole] = useState(0);

  // Debug: Log profile data
  useEffect(() => {
    if (profile) {
      console.log('HeroSection - Profile Photo URL:', profile.profile_photo_url);
      console.log('HeroSection - Full Profile:', profile);
      console.log('HeroSection - Roles:', profile.roles);
      console.log('HeroSection - Stats:', profile.stats);
    }
  }, [profile]);

  // Use profile roles if available, otherwise use defaults
  const roles = profile?.roles && Array.isArray(profile.roles) && profile.roles.length > 0
    ? profile.roles.map((r: any) => r.text || r)
    : defaultRoles;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* Floating Icons */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] hidden lg:block"
      >
        <Code2 className="w-8 h-8 text-primary/30" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-[10%] hidden lg:block"
      >
        <Cpu className="w-10 h-10 text-primary/20" />
      </motion.div>
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-[10%] hidden lg:block"
      >
        <Database className="w-6 h-6 text-primary/25" />
      </motion.div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight"
            >
              Hi, I'm{" "}
              <span className="text-gradient">{profile?.full_name || "Your Name"}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] mb-4"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent break-words font-extrabold tracking-wide drop-shadow-[0_0_20px_rgba(16,185,129,0.7)] leading-normal">
                {">"} {roles[currentRole]}
                <span className="animate-pulse">_</span>
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-lg lg:max-w-xl mb-6 leading-relaxed font-medium drop-shadow-sm"
            >
              {profile?.short_intro || "Passionate about building innovative solutions and exploring the frontiers of technology. Currently pursuing Computer Science with a focus on Machine Learning and Software Development."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              {profile?.cv_url ? (
                <Button variant="hero" size="lg" asChild>
                  <a href={profile.cv_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5" />
                    Download CV
                  </a>
                </Button>
              ) : (
                <Button variant="hero" size="lg" disabled>
                  <Download className="w-5 h-5" />
                  Download CV
                </Button>
              )}
              <Button variant="heroOutline" size="lg" asChild>
                <a href="#contact">
                  <Mail className="w-5 h-5" />
                  Contact Me
                </a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 sm:gap-8 mt-8 sm:mt-12 justify-center lg:justify-start"
            >
              {(profile?.stats && Array.isArray(profile.stats) && profile.stats.length > 0
                ? profile.stats
                : [
                    { value: "15+", label: "Projects" },
                    { value: "3+", label: "Years Exp" },
                    { value: "500+", label: "Problems Solved" },
                  ]
              ).map((stat: any, index: number) => (
                <div key={index} className="text-center min-w-[80px]">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-110" />
              
              {/* Image Container */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 sm:border-4 border-primary/30 glow-teal">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                {!isLoading && profile?.profile_photo_url && (
                  <img
                    key={profile.profile_photo_url}
                    src={`${profile.profile_photo_url}${profile.profile_photo_url.includes('?') ? '&' : '?'}t=${Date.now()}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full"
              />
              
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl px-4 py-2 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{profile?.availability_text || "Open to work"}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll Down</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

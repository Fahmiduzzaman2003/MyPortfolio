import { motion } from "framer-motion";
import { FileText, ExternalLink, Lightbulb, CheckCircle, Clock, Brain, FlaskConical, Microscope, TrendingUp } from "lucide-react";
import { ResearchFloatingIcons, SectionDecorativeElements } from "./SectionFloatingIcons";
import { useResearch } from "@/hooks/usePortfolioData";

const statusConfig = {
  published: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  Published: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  ongoing: { icon: Clock, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  Ongoing: { icon: Clock, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  Completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  idea: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  Idea: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
};

const iconMap: { [key: number]: any } = {
  0: Brain,
  1: FlaskConical,
  2: TrendingUp,
  3: Microscope,
  4: FileText,
};

const ResearchSection = () => {
  const { data: research = [], isLoading } = useResearch();

  if (isLoading) {
    return (
      <section id="research" className="section-padding relative">
        <div className="container-custom">
          <div className="text-center py-20 animate-pulse text-muted-foreground">
            Loading Research...
          </div>
        </div>
      </section>
    );
  }

  if (research.length === 0) {
    return (
      <section id="research" className="section-padding relative">
        <ResearchFloatingIcons />
        <SectionDecorativeElements variant="grid" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Research
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Academic <span className="text-gradient">Research</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My research contributions exploring the frontiers of AI, machine learning, and software engineering.
            </p>
          </motion.div>
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No research papers added yet</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="research" className="section-padding relative">
      <ResearchFloatingIcons />
      <SectionDecorativeElements variant="grid" />
      
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
              Research Publications
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My research contributions exploring the frontiers of AI, machine learning, and software engineering.
          </p>
        </motion.div>

        <div className="space-y-6">
          {research.map((item: any, index: number) => {
            const statusKey = item.status || 'ongoing';
            const statusInfo = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.ongoing;
            const StatusIcon = statusInfo.icon;
            const statusColor = statusInfo.color;
            const statusBg = statusInfo.bg;
            const statusBorder = statusInfo.border;
            const ResearchIcon = iconMap[index % Object.keys(iconMap).length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-primary/40 rounded-2xl p-6 md:p-8 card-hover group shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <motion.div 
                      className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ResearchIcon className="w-7 h-7 text-primary" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    {/* Title and Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-gradient">{item.title}</h3>
                      <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${statusBg} ${statusBorder} border shadow-lg`}>
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                        <span className={`text-sm font-semibold ${statusColor} capitalize`}>{item.status}</span>
                      </div>
                    </div>

                    {/* Venue */}
                    {item.venue && (
                      <div className="mb-4 flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                        <p className="text-base font-medium text-primary/90 tracking-wide">
                          {item.venue}
                        </p>
                      </div>
                    )}

                    {/* Abstract */}
                    <p className="text-base leading-relaxed text-muted-foreground/90 mb-6 italic border-l-4 border-primary/30 pl-4 py-2 bg-primary/5 rounded-r">
                      {item.abstract}
                    </p>

                    {/* Technologies and Paper Link */}
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.technologies && item.technologies.length > 0 && item.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 hover:border-primary/40 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {item.paper_url && (
                        <motion.a
                          href={item.paper_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all shadow-md hover:shadow-lg hover:shadow-primary/20"
                          whileHover={{ scale: 1.05, x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Paper
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;

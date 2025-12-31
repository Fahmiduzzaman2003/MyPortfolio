import { motion } from "framer-motion";
import { ExternalLink, Github, Folder, Code2, Rocket, Cpu, Database, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFloatingIcons, SectionDecorativeElements } from "./SectionFloatingIcons";
import { useProjects } from "@/hooks/usePortfolioData";

// Animated tech stack icons that appear on hover
const TechStackIcon = ({ tech, index }: { tech: string; index: number }) => {
  const iconMap: Record<string, JSX.Element> = {
    React: <Globe className="w-3 h-3" />,
    Python: <Code2 className="w-3 h-3" />,
    Node: <Cpu className="w-3 h-3" />,
    TypeScript: <Code2 className="w-3 h-3" />,
    PostgreSQL: <Database className="w-3 h-3" />,
    MongoDB: <Database className="w-3 h-3" />,
    default: <Code2 className="w-3 h-3" />,
  };

  const getIcon = () => {
    for (const key of Object.keys(iconMap)) {
      if (tech.toLowerCase().includes(key.toLowerCase())) {
        return iconMap[key];
      }
    }
    return iconMap.default;
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 border border-primary/30 text-primary font-semibold flex items-center gap-1.5 hover:bg-primary/30 hover:scale-105 transition-all duration-300 shadow-sm"
    >
      {getIcon()}
      {tech}
    </motion.span>
  );
};

const ProjectsSection = () => {
  const { data: projects, isLoading } = useProjects();
  
  // Use fetched projects or empty array if loading
  const projectsData = projects || [];
  return (
    <section id="projects" className="section-padding bg-card/30 relative">
      <ProjectFloatingIcons />
      <SectionDecorativeElements variant="circles" />
      
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
              Featured Projects
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent projects demonstrating skills in full-stack development, machine learning, and more.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projectsData.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          ) : (
            projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-primary/40 rounded-2xl overflow-hidden card-hover shadow-[0_0_15px_rgba(20,184,166,0.3)]"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image_url || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Overlay Links */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(Array.isArray(project.tech_stack) 
                      ? project.tech_stack 
                      : typeof project.tech_stack === 'string' 
                        ? JSON.parse(project.tech_stack) 
                        : []
                    ).map((tech: string, i: number) => (
                      <TechStackIcon key={i} tech={tech} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
          )}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/Fahmiduzzaman2003"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="group">
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              View More on GitHub
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;

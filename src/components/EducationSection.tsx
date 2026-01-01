import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen, Award, Code, TrendingUp, BookMarked } from "lucide-react";
import { EducationFloatingIcons, SectionDecorativeElements } from "./SectionFloatingIcons";
import { useEducation } from "@/hooks/usePortfolioData";

const EducationSection = () => {
  const { data: education, isLoading } = useEducation();

  if (isLoading) {
    return (
      <section id="education" className="section-padding bg-card/30 relative">
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="animate-pulse">Loading education...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="section-padding bg-card/30 relative">
      <EducationFloatingIcons />
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
              Academic Journey
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My educational background that shaped my technical foundation and passion for technology.
          </p>
        </motion.div>

        {!education || education.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No education records added yet.
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

            <div className="space-y-12">
              {education.map((edu: any, index: number) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative grid md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? "md:text-right" : "md:text-left md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:col-start-2"}`}>
                  <div className="bg-card border border-primary/40 rounded-2xl p-6 card-hover group shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    <div className={`flex items-start gap-3 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <motion.div 
                        className="w-12 h-12 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                        <h3 className="font-bold text-xl leading-tight mb-1.5 group-hover:text-primary transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-primary text-base font-medium leading-tight">
                          {edu.institution}
                        </p>
                      </div>
                    </div>

                    <div className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">{edu.description}</p>

                    {/* CGPA and Semesters Stats */}
                    {(edu.cgpa || edu.semester_completed) && (
                      <div className={`flex flex-wrap gap-3 mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        {edu.cgpa && edu.cgpa_scale && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20"
                          >
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">CGPA</p>
                              <p className="text-lg font-bold text-primary">
                                {edu.cgpa}<span className="text-sm font-normal text-muted-foreground">/{edu.cgpa_scale}</span>
                              </p>
                            </div>
                          </motion.div>
                        )}
                        {edu.semester_completed && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border"
                          >
                            <BookOpen className="w-4 h-4 text-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Progress</p>
                              <p className="text-sm font-semibold">{edu.semester_completed}</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Core Courses */}
                    {edu.core_courses && (
                      <div className={index % 2 === 0 ? "md:text-right" : ""}>
                        <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <BookMarked className="w-4 h-4 text-primary" />
                          <p className="text-xs font-semibold text-primary">Core Courses Passed</p>
                        </div>
                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          {edu.core_courses.split(',').map((course: string, i: number) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + (0.05 * i) }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-foreground hover:from-primary/30 hover:to-primary/20 transition-all cursor-default border border-primary/20 font-medium"
                            >
                              {course.trim()}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Removed courses section since it's not in the database schema */}
                  </div>
                </div>

                {/* Empty Column for Alternating Layout */}
                {index % 2 === 0 ? <div className="hidden md:block" /> : null}
              </motion.div>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;

import { motion } from "framer-motion";
import { Database, Code, Cpu, Wifi, Target, Rocket, Radio, Wrench, Terminal, GitBranch, Globe, Zap } from "lucide-react";

// Shared icon container styles with bright teal border
const iconContainerClass = "absolute flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-cyan bg-background/80 backdrop-blur-sm shadow-lg shadow-cyan/20";

// Co-Curricular Activities floating icons
export const CoCurricularFloatingIcons = () => {
  const icons = [
    { icon: "🤝", delay: 0, x: "8%", y: "12%" },     // Teamwork
    { icon: "👑", delay: 0.2, x: "88%", y: "18%" },  // Leadership
    { icon: "🎯", delay: 0.4, x: "6%", y: "35%" },   // Vision/Goals
    { icon: "💬", delay: 0.6, x: "90%", y: "40%" },  // Communication
    { icon: "🌟", delay: 0.3, x: "10%", y: "58%" },  // Excellence
    { icon: "🎪", delay: 0.5, x: "86%", y: "62%" },  // Events
    { icon: "🏛️", delay: 0.7, x: "8%", y: "78%" },   // Organization
    { icon: "🎭", delay: 0.8, x: "88%", y: "82%" },  // Activities
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={iconContainerClass}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.6, type: "spring", stiffness: 150 }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          //@ts-ignore
          transition={{
            y: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-xl md:text-2xl">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Project-related floating icons
export const ProjectFloatingIcons = () => {
  const icons = [
    { icon: "💻", delay: 0, x: "8%", y: "8%" },
    { icon: "🚀", delay: 0.2, x: "88%", y: "10%" },
    { icon: "⚡", delay: 0.4, x: "6%", y: "22%" },
    { icon: "🔧", delay: 0.6, x: "90%", y: "25%" },
    { icon: "📱", delay: 0.3, x: "10%", y: "36%" },
    { icon: "🌐", delay: 0.5, x: "86%", y: "40%" },
    { icon: "🛠️", delay: 0.7, x: "8%", y: "50%" },
    { icon: "⚙️", delay: 0.8, x: "88%", y: "54%" },
    { icon: "🎨", delay: 0.9, x: "6%", y: "64%" },
    { icon: "💡", delay: 1.0, x: "90%", y: "68%" },
    { icon: "🔌", delay: 1.1, x: "10%", y: "78%" },
    { icon: "📊", delay: 1.2, x: "86%", y: "82%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={iconContainerClass}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.5 }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          //@ts-ignore
          transition={{
            y: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-xl md:text-2xl">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Research-related floating icons
export const ResearchFloatingIcons = () => {
  const icons = [
    { icon: "🔬", delay: 0, x: "6%", y: "35%" },
    { icon: "📊", delay: 0.2, x: "88%", y: "25%" },
    { icon: "🧬", delay: 0.4, x: "4%", y: "55%" },
    { icon: "📈", delay: 0.6, x: "90%", y: "65%" },
    { icon: "🧠", delay: 0.3, x: "8%", y: "75%" },
    { icon: "💡", delay: 0.5, x: "86%", y: "85%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={iconContainerClass}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.5 }}
          animate={{
            y: [0, -12, 0],
            x: [0, 5, -5, 0],
          }}
          //@ts-ignore
          transition={{
            y: { duration: 5 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 7 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-xl md:text-2xl">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

// About section floating icons
export const AboutFloatingIcons = () => {
  const icons = [
    { Icon: Database, delay: 0, x: "8%", y: "20%" },
    { Icon: Code, delay: 0.2, x: "90%", y: "15%" },
    { Icon: Globe, delay: 0.4, x: "6%", y: "45%" },
    { Icon: Zap, delay: 0.6, x: "92%", y: "50%" },
    { Icon: Target, delay: 0.3, x: "10%", y: "70%" },
    { Icon: Rocket, delay: 0.5, x: "88%", y: "75%" },
    { Icon: Radio, delay: 0.7, x: "5%", y: "90%" },
    { Icon: Cpu, delay: 0.8, x: "94%", y: "85%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg border border-cyan/30 bg-background/60 backdrop-blur-sm"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.5 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          //@ts-ignore
          transition={{
            duration: 2.5 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <item.Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
        </motion.div>
      ))}
    </div>
  );
};

// Achievement-related floating icons
export const AchievementFloatingIcons = () => {
  const icons = [
    { icon: "🏆", delay: 0, x: "8%", y: "10%" },
    { icon: "🎯", delay: 0.2, x: "88%", y: "12%" },
    { icon: "⭐", delay: 0.4, x: "6%", y: "24%" },
    { icon: "🎖️", delay: 0.6, x: "90%", y: "28%" },
    { icon: "🏅", delay: 0.3, x: "10%", y: "38%" },
    { icon: "✨", delay: 0.5, x: "86%", y: "42%" },
    { icon: "🌟", delay: 0.7, x: "8%", y: "52%" },
    { icon: "💫", delay: 0.8, x: "88%", y: "56%" },
    { icon: "🎓", delay: 0.9, x: "6%", y: "66%" },
    { icon: "📜", delay: 1.0, x: "90%", y: "70%" },
    { icon: "🥇", delay: 1.1, x: "10%", y: "80%" },
    { icon: "🔥", delay: 1.2, x: "86%", y: "84%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={iconContainerClass}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.6, type: "spring" }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          //@ts-ignore
          transition={{
            scale: { duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-xl md:text-2xl">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Education-related floating icons
export const EducationFloatingIcons = () => {
  const icons = [
    { icon: "📚", delay: 0, x: "7%", y: "15%" },
    { icon: "🎓", delay: 0.2, x: "90%", y: "20%" },
    { icon: "📖", delay: 0.4, x: "10%", y: "60%" },
    { icon: "✏️", delay: 0.6, x: "88%", y: "65%" },
    { icon: "🎯", delay: 0.3, x: "5%", y: "38%" },
    { icon: "💫", delay: 0.5, x: "92%", y: "42%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={iconContainerClass}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: item.delay, duration: 0.5 }}
          animate={{
            y: [0, -10, 0],
          }}
          //@ts-ignore
          transition={{
            y: { duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-xl md:text-2xl">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

// SVG-based decorative elements for sections
export const SectionDecorativeElements = ({ variant = "default" }: { variant?: "default" | "dots" | "circles" | "grid" }) => {
  if (variant === "dots") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg className="absolute top-0 left-0 w-full h-full">
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-primary/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
    );
  }

  if (variant === "circles") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="absolute top-0 left-0 w-full h-full">
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    );
  }

  return null;
};

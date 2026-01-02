import { motion } from "framer-motion";
import { Terminal, Heart, ArrowUp, Coffee } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-custom py-8 sm:py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="font-mono font-bold text-lg">{"<Fz/>"}</span>
          </motion.a>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground text-center"
          >
            <span className="whitespace-nowrap">© {currentYear} Fahmid.</span>
            <span className="flex flex-wrap items-center justify-center gap-1">
              <span className="whitespace-nowrap">Developed By Power of</span>{" "}
              <Coffee className="w-4 h-4 text-primary" />
              {" "}<span>and</span>{" "}
              <span className="font-mono text-primary whitespace-nowrap">{"</code>"}</span>
            </span>
          </motion.div>

          {/* Back to Top */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            Back to top
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
              <ArrowUp className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

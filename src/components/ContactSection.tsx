import { motion } from "framer-motion";
import { Send, MessageSquare, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useContactInfo } from "@/hooks/usePortfolioData";
import { messagesApi } from "@/lib/api";
import { toast } from "sonner";

// Brand Logo Components
const BrandLogos: Record<string, React.FC<{ className?: string }>> = {
  MessageCircle: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#25D366" d="M24 0C10.745 0 0 10.745 0 24c0 4.243 1.107 8.224 3.035 11.673L0 48l12.594-3.018C16.022 46.888 19.918 48 24 48c13.255 0 24-10.745 24-24S37.255 0 24 0z"/>
      <path fill="#FFF" d="M35.176 30.59c-.457 1.285-2.27 2.357-3.715 2.666-.966.207-2.23.373-6.485-1.39-5.437-2.256-8.952-7.75-9.22-8.107-.265-.357-2.166-2.88-2.166-5.496s1.37-3.898 1.856-4.43c.486-.532 1.06-.665 1.414-.665.354 0 .707.003 1.017.018.326.015.763-.124 1.192.91.43 1.033 1.465 3.577 1.594 3.836.13.26.216.562.043.907-.173.346-.26.562-.518.864-.26.302-.544.674-.776.905-.26.26-.532.54-.228.1.303.56 1.35 2.23 2.9 3.612 1.993 1.78 3.672 2.334 4.193 2.594.52.26.822.216 1.125-.13.303-.345 1.3-1.517 1.646-2.04.346-.52.69-.432 1.164-.26.475.173 3.017 1.423 3.535 1.682.52.26.865.388 1 .606.13.216.13 1.25-.327 2.532z"/>
    </svg>
  ),
  Linkedin: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#0078D4" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z"/>
      <path fill="#FFF" d="M12 19h5v17h-5V19zm2.485-2h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99-.144.35-.101 1.318-.101 1.807v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"/>
    </svg>
  ),
  Mail: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#4CAF50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z"/>
      <path fill="#1E88E5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/>
      <polygon fill="#E53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
      <path fill="#C62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8h0C4.924 8 3 9.924 3 12.298z"/>
      <path fill="#FBC02D" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8h0C43.076 8 45 9.924 45 12.298z"/>
    </svg>
  ),
  Github: ({ className }) => (
    <svg viewBox="0 0 48 48" className={className}>
      <linearGradient id="github-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6e5494', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#24292e', stopOpacity: 1 }} />
      </linearGradient>
      <path fill="url(#github-grad)" d="M24 4C12.954 4 4 12.954 4 24c0 8.887 5.771 16.408 13.765 19.053 1.007.185 1.373-.437 1.373-.971 0-.479-.018-2.065-.028-3.742-5.572 1.21-6.748-2.363-6.748-2.363-.916-2.328-2.237-2.946-2.237-2.946-1.829-1.25.138-1.225.138-1.225 2.023.143 3.087 2.076 3.087 2.076 1.798 3.082 4.717 2.191 5.865 1.675.182-1.302.704-2.191 1.28-2.694-4.476-.509-9.178-2.238-9.178-9.963 0-2.2.786-4 2.076-5.41-.208-.51-.899-2.562.197-5.34 0 0 1.693-.542 5.543 2.066 1.607-.447 3.33-.67 5.043-.678 1.712.008 3.435.231 5.043.678 3.85-2.608 5.541-2.066 5.541-2.066 1.097 2.778.406 4.83.198 5.34 1.292 1.41 2.074 3.21 2.074 5.41 0 7.745-4.71 9.448-9.198 9.945.723.623 1.367 1.852 1.367 3.733 0 2.695-.024 4.867-.024 5.527 0 .538.363 1.164 1.38.968C38.237 40.402 44 32.883 44 24c0-11.046-8.954-20-20-20z"/>
    </svg>
  ),
  Facebook: ({ className }) => (
  <svg viewBox="0 0 48 48" className={className}>
    <linearGradient id="facebook-grad-admin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: '#1877F2', stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: '#0A3D91', stopOpacity: 1 }} />
    </linearGradient>
    <path
      fill="url(#facebook-grad-admin)"
      d="M24 4C12.954 4 4 12.954 4 24c0 9.982 7.313 18.255 16.875 19.75v-14h-4.22v-5.75h4.22v-4.384c0-4.17 2.485-6.48 6.288-6.48 1.823 0 3.73.326 3.73.326v4.11h-2.102c-2.07 0-2.716 1.286-2.716 2.604v3.824h4.62l-.738 5.75h-3.882v14C36.687 42.255 44 33.982 44 24 44 12.954 35.046 4 24 4z"
    />
  </svg>
)
,


  MapPin: ({ className }) => <MapPin className={className} />,
  Phone: ({ className }) => <Phone className={className} />,
};

const ContactSection = () => {
  const { data: contactInfo, isLoading } = useContactInfo();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await messagesApi.submit(formData);
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract contact links, location, and response time from contactInfo
  const contactLinks = contactInfo?.filter((item: any) => item.type === "link") || [];
  const location = contactInfo?.find((item: any) => item.type === "location");
  const responseTime = contactInfo?.find((item: any) => item.type === "response_time");

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 relative z-10"
              style={{
                backgroundImage: "linear-gradient(90deg, #14b8a6, #06b6d4, #10b981)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Let's Connect
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out through any of the channels below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Get in Touch</h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {isLoading ? (
                <div className="col-span-2 text-center py-4 text-muted-foreground">
                  Loading contact info...
                </div>
              ) : contactLinks.length === 0 ? (
                <div className="col-span-2 text-center py-4 text-muted-foreground">
                  No contact links available yet.
                </div>
              ) : (
                contactLinks.map((link: any, index: number) => {
                  const LogoComponent = BrandLogos[link.icon_name];
                  return (
                    <motion.a
                      key={link.id}
                      href={link.href || "#"}
                      target={link.href ? "_blank" : undefined}
                      rel={link.href ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 min-h-[4.5rem]"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2 shadow-sm">
                        {LogoComponent ? (
                          <LogoComponent className="w-full h-full" />
                        ) : (
                          <MessageSquare className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{link.label}</p>
                        <p className="text-sm font-medium truncate">{link.value}</p>
                      </div>
                    </motion.a>
                  );
                })
              )}
            </div>

            {/* Location Info */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              {location && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{location.label}</p>
                    <p className="text-sm text-muted-foreground">{location.value}</p>
                  </div>
                </div>
              )}
              {responseTime && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{responseTime.label}</p>
                    <p className="text-sm text-muted-foreground">{responseTime.value}</p>
                  </div>
                </div>
              )}
              {!location && !responseTime && (
                <div className="text-center py-4 text-muted-foreground">
                  No location or response time info available.
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Send a Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm sm:text-base"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

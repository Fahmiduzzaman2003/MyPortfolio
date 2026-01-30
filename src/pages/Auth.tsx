import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const { signIn, signInWith2FA, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (requiresTwoFactor) {
        // Verify 2FA code
        if (twoFactorCode.length !== 6) {
          toast.error("Please enter a valid 6-digit code");
          setIsLoading(false);
          return;
        }

        const { error } = await signInWith2FA(email, twoFactorCode);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Logged in successfully!");
          navigate("/admin");
        }
      } else {
        // Initial login with email and password
        authSchema.parse({ email, password });
        const { error, requiresTwoFactor: needs2FA } = await signIn(email, password);
        
        if (error) {
          toast.error(error.message);
        } else if (needs2FA) {
          setRequiresTwoFactor(true);
          toast.info("Please enter your 2FA code");
        } else {
          toast.success("Logged in successfully!");
          navigate("/admin");
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <span className="font-mono font-bold text-xl">{"<Admin />"}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            {requiresTwoFactor ? "Two-Factor Authentication" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {requiresTwoFactor
              ? "Enter the code from your authenticator app"
              : "Sign in to access the admin panel"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!requiresTwoFactor ? (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-border"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-secondary/50 border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-10 h-12 bg-secondary/50 border-border text-center text-2xl tracking-widest"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : requiresTwoFactor ? "Verify Code" : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {requiresTwoFactor && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setRequiresTwoFactor(false);
                  setTwoFactorCode("");
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to login
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">
              Back to Portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

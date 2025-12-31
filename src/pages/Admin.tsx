import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  User,
  GraduationCap,
  Wrench,
  FolderKanban,
  FlaskConical,
  Trophy,
  MessageSquare,
  LogOut,
  FileText,
  Menu,
  X,
  Code2,
  Briefcase,
  Contact,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useContactMessages } from "@/hooks/usePortfolioData";
import { toast } from "sonner";

import AdminProfile from "@/components/admin/AdminProfile";
import AdminEducation from "@/components/admin/AdminEducation";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminResearch from "@/components/admin/AdminResearch";
import AdminAchievements from "@/components/admin/AdminAchievements";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminCV from "@/components/admin/AdminCV";
import AdminCodingPlatforms from "@/components/admin/AdminCodingPlatforms";
import AdminCoCurricular from "@/components/admin/AdminCoCurricular";
import AdminExperience from "@/components/admin/AdminExperience";
import AdminContactInfo from "@/components/admin/AdminContactInfo";

const menuItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "coding", label: "Coding Platforms", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "research", label: "Research", icon: FlaskConical },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "cocurricular", label: "Co-Curricular", icon: Users },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "contact", label: "Contact Info", icon: Contact },
  { id: "cv", label: "CV / Resume", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();
  const { data: messages, isError: messagesError } = useContactMessages();
  const navigate = useNavigate();

  const unreadCount = React.useMemo(() => {
    if (!messages || messagesError) return 0;
    return messages.filter((m: any) => !m.is_read).length;
  }, [messages, messagesError]);

  useEffect(() => {
    // No authentication required - admin panel is always accessible
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // No authentication check needed

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <AdminProfile />;
      case "education":
        return <AdminEducation />;
      case "skills":
        return <AdminSkills />;
      case "coding":
        return <AdminCodingPlatforms />;
      case "projects":
        return <AdminProjects />;
      case "research":
        return <AdminResearch />;
      case "achievements":
        return <AdminAchievements />;
      case "cocurricular":
        return <AdminCoCurricular />;
      case "experience":
        return <AdminExperience />;
      case "contact":
        return <AdminContactInfo />;
      case "cv":
        return <AdminCV />;
      case "messages":
        return <AdminMessages />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4" style={{ zIndex: 100 }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono font-bold">Admin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-card border-r border-border transition-transform lg:transition-none ${
          sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-mono font-bold text-lg">{"<Admin />"}</span>
              <p className="text-xs text-muted-foreground">Portfolio Manager</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === "messages" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Terminal className="w-5 h-5" />
              View Portfolio
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 lg:hidden"
          style={{ zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;

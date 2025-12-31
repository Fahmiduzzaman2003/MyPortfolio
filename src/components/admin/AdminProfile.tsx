import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, uploadApi } from "@/lib/api";
import { useProfile } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Upload, User, Plus, X } from "lucide-react";

interface RoleItem {
  text: string;
}

interface StatItem {
  value: string;
  label: string;
}

// Helper to prevent crashes if backend sends null/undefined/objects instead of arrays
const safeArray = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // If backend sends a stringified JSON, try to parse it
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const AdminProfile = () => {
  const { data: profile, isLoading, isError, error } = useProfile();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: "",
    tagline: "",
    short_intro: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    whatsapp_number: "",
    profile_photo_url: "",
    cv_url: "",
    availability_text: "Open to work",
    roles: [] as RoleItem[],
    stats: [] as StatItem[],
  });

  const [dataLoaded, setDataLoaded] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newStat, setNewStat] = useState({ value: "", label: "" });

  // 1. SAFE DATA SYNC - Fixed version with fallback for empty database
  useEffect(() => {
    if (profile && !dataLoaded) {
      console.log("Profile Data Received:", profile); // DEBUG: Check console to see what arrives

      const mappedData = {
        full_name: profile.full_name || "",
        tagline: profile.tagline || "",
        short_intro: profile.short_intro || "",
        bio: profile.bio || "",
        location: profile.location || "",
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        whatsapp_number: profile.whatsapp_number || "",
        profile_photo_url: profile.profile_photo_url || "",
        cv_url: profile.cv_url || "",
        availability_text: profile.availability_text || "Open to work",
        // 2. CRASH PREVENTION: strictly force arrays
        roles: safeArray(profile.roles),
        stats: safeArray(profile.stats),
      };

      console.log("Mapped Data:", mappedData); // DEBUG
      setFormData(mappedData);
      setDataLoaded(true);
    } else if (!profile && !isLoading && !dataLoaded) {
      // If no profile exists after loading completes, allow form to show with defaults
      console.log("No profile data found, initializing empty form");
      setDataLoaded(true);
    }
  }, [profile, dataLoaded, isLoading]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      console.log('=== Mutation Function Called ===');
      console.log('Data being sent to API:', JSON.stringify(data, null, 2));
      return profileApi.update(data);
    },
    onSuccess: async (response) => {
      console.log('=== Mutation Success ===');
      console.log('Response:', response);
      // Force immediate refetch of profile data
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.refetchQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
      setDataLoaded(false); // Allow refresh after save
      // Reload the page to ensure all data is fresh
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadApi.upload(file);
      setFormData((prev) => ({ ...prev, profile_photo_url: url }));
      toast.success("Photo uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const addRole = () => {
    if (newRole.trim()) {
      const updatedRoles = [...formData.roles, { text: newRole.trim() }];
      console.log('Adding role:', newRole.trim());
      console.log('Updated roles array:', updatedRoles);
      setFormData({
        ...formData,
        roles: updatedRoles,
      });
      setNewRole("");
    }
  };

  const removeRole = (index: number) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index),
    });
  };

  const addStat = () => {
    if (newStat.value.trim() && newStat.label.trim()) {
      const updatedStats = [...formData.stats, { value: newStat.value.trim(), label: newStat.label.trim() }];
      console.log('Adding stat:', { value: newStat.value.trim(), label: newStat.label.trim() });
      console.log('Updated stats array:', updatedStats);
      setFormData({
        ...formData,
        stats: updatedStats,
      });
      setNewStat({ value: "", label: "" });
    }
  };

  const removeStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== Form Submit ===');
    console.log('Roles:', JSON.stringify(formData.roles, null, 2));
    console.log('Stats:', JSON.stringify(formData.stats, null, 2));
    console.log('Roles count:', formData.roles.length);
    console.log('Stats count:', formData.stats.length);
    console.log('Full formData:', JSON.stringify(formData, null, 2));
    mutation.mutate(formData);
  };

  // 4. LOADING STATE VISIBILITY (Added text-white)
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  // 5. ERROR STATE HANDLING - Allow empty profile for first-time setup
  if (isError) {
    console.error("Profile Load Error:", error);
    // If no profile exists yet, initialize with empty data
    if (!dataLoaded && error?.message?.includes("No profile")) {
      setFormData({
        full_name: "",
        tagline: "",
        short_intro: "",
        bio: "",
        location: "",
        email: "",
        phone: "",
        linkedin_url: "",
        github_url: "",
        whatsapp_number: "",
        profile_photo_url: "",
        cv_url: "",
        availability_text: "Open to work",
        roles: [],
        stats: [],
      });
      setDataLoaded(true);
    }
  }

  // 6. Wait for data to be loaded into state (reduced wait time)
  if (!dataLoaded && !isError) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Preparing form...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-white">Profile Settings</h1>
        <p className="text-gray-400">Manage your personal information, hero section content, and social links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-20">
        {/* Photo Upload */}
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
              {formData.profile_photo_url ? (
                <img src={formData.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors z-10">
              <Upload className="w-4 h-4 text-primary-foreground" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block text-gray-300">Profile Image URL</label>
            <Input
              placeholder="Or paste image URL"
              value={formData.profile_photo_url}
              onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Full Name</label>
            <Input
              placeholder="Fahmiduzzaman"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Tagline</label>
            <Input
              placeholder="CSE Student | ML Enthusiast"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Availability Status</label>
          <Input
            placeholder="Open to work"
            value={formData.availability_text}
            onChange={(e) => setFormData({ ...formData, availability_text: e.target.value })}
            className="bg-secondary/50 border-gray-700 text-white"
          />
        </div>

        {/* Roles Section - FIXED */}
        <div className="bg-card/30 border border-gray-800 rounded-xl p-4">
          <label className="text-sm font-medium mb-3 block text-gray-300">Hero Rotating Roles</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.isArray(formData.roles) && formData.roles.length > 0 ? (
              formData.roles.map((role, index) => (
                <span
                  key={`role-${index}`}
                  className="bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-primary/20"
                >
                  {role?.text || ""}
                  <button type="button" onClick={() => removeRole(index)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No roles added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add role (e.g., Full Stack Developer)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRole();
                }
              }}
              className="bg-secondary/50 border-gray-700 text-white"
            />
            <Button type="button" variant="outline" onClick={addRole} className="border-gray-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Section - FIXED */}
        <div className="bg-card/30 border border-gray-800 rounded-xl p-4">
          <label className="text-sm font-medium mb-3 block text-gray-300">Hero Stats</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {Array.isArray(formData.stats) && formData.stats.length > 0 ? (
              formData.stats.map((stat, index) => (
                <div
                  key={`stat-${index}`}
                  className="bg-secondary/50 px-4 py-2 rounded-lg flex items-center gap-3 border border-gray-700"
                >
                  <div className="text-center">
                    <div className="font-bold text-primary">{stat?.value || ""}</div>
                    <div className="text-xs text-gray-400">{stat?.label || ""}</div>
                  </div>
                  <button type="button" onClick={() => removeStat(index)} className="text-gray-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No stats added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Value"
              value={newStat.value}
              onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white w-32"
            />
            <Input
              placeholder="Label"
              value={newStat.label}
              onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addStat();
                }
              }}
              className="bg-secondary/50 border-gray-700 text-white flex-1"
            />
            <Button type="button" variant="outline" onClick={addStat} className="border-gray-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Short Intro</label>
          <Textarea
            value={formData.short_intro}
            onChange={(e) => setFormData({ ...formData, short_intro: e.target.value })}
            className="bg-secondary/50 border-gray-700 text-white"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="bg-secondary/50 border-gray-700 text-white"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">LinkedIn URL</label>
            <Input
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">GitHub URL</label>
            <Input
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-300">WhatsApp Number</label>
            <Input
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="bg-secondary/50 border-gray-700 text-white"
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default AdminProfile;
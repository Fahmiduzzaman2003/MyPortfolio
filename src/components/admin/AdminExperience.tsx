import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Briefcase, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExperience } from "@/hooks/usePortfolioData";
import { experienceApi, uploadApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExperienceItem {
  id?: number;
  company_name: string;
  position: string;
  duration: string;
  description: string;
  company_logo_url: string;
  display_order: number;
}

const AdminExperience = () => {
  const { data: experiences, isLoading } = useExperience();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editItem, setEditItem] = useState<ExperienceItem | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const emptyItem: ExperienceItem = {
    company_name: "",
    position: "",
    duration: "",
    description: "",
    company_logo_url: "",
    display_order: 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: ExperienceItem) => {
      // Upload logo if provided
      let logoUrl = item.company_logo_url;
      if (logoFile) {
        console.log("Uploading logo file:", logoFile.name);
        const uploadResponse = await uploadApi.upload(logoFile);
        console.log("Upload response:", uploadResponse);
        logoUrl = uploadResponse.url;
      }

      console.log("Saving experience with payload:", {
        company_name: item.company_name,
        position: item.position,
        duration: item.duration,
        company_logo_url: logoUrl,
      });

      const payload = {
        company_name: item.company_name,
        position: item.position,
        duration: item.duration,
        description: item.description,
        company_logo_url: logoUrl,
        display_order: item.display_order,
      };

      if (item.id) {
        return experienceApi.update(item.id, payload);
      } else {
        return experienceApi.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience saved successfully!");
      setIsAdding(false);
      setEditItem(null);
      setLogoFile(null);
      setLogoPreview("");
    },
    onError: (error: any) => {
      console.error("Save experience error:", error);
      toast.error(`Failed to save experience: ${error?.message || 'Unknown error'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete experience");
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file);
    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        console.log("Logo preview set");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

  const handleSave = () => {
    if (editItem) {
      saveMutation.mutate(editItem);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Work Experience</h2>
        </div>
        <Button
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
            setLogoFile(null);
            setLogoPreview("");
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editItem) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">
            {editItem?.id ? "Edit Experience" : "Add New Experience"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name *</label>
              <Input
                value={editItem?.company_name || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem!, company_name: e.target.value })
                }
                placeholder="e.g., Google"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Position *</label>
              <Input
                value={editItem?.position || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem!, position: e.target.value })
                }
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration *</label>
              <Input
                value={editItem?.duration || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem!, duration: e.target.value })
                }
                placeholder="e.g., Jan 2020 - Dec 2023"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input
                type="number"
                value={editItem?.display_order || 0}
                onChange={(e) =>
                  setEditItem({
                    ...editItem!,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={editItem?.description || ""}
              onChange={(e) =>
                setEditItem({ ...editItem!, description: e.target.value })
              }
              placeholder="Brief description of your role and achievements..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <div className="flex gap-4 items-start">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {logoFile ? logoFile.name : "Upload Logo"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>

              {(logoPreview || editItem?.company_logo_url) && (
                <div className="w-24 h-24 border border-border rounded-lg overflow-hidden bg-white">
                  <img
                    src={logoPreview || editItem?.company_logo_url}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setEditItem(null);
                setLogoFile(null);
                setLogoPreview("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {experiences?.map((exp: ExperienceItem) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex gap-4">
              {exp.company_logo_url && (
                <div className="w-16 h-16 flex-shrink-0 border border-border rounded-lg overflow-hidden bg-white">
                  <img
                    src={exp.company_logo_url}
                    alt={exp.company_name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{exp.company_name}</h3>
                <p className="text-primary text-sm">{exp.position}</p>
                <p className="text-muted-foreground text-sm">{exp.duration}</p>
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {exp.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditItem(exp);
                    setIsAdding(false);
                    setLogoPreview("");
                    setLogoFile(null);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Delete experience at ${exp.company_name}?`
                      )
                    ) {
                      deleteMutation.mutate(exp.id!);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {!experiences?.length && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExperience;

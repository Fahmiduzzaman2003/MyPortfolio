import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { achievementsApi, uploadApi } from "@/lib/api";
import { useAchievements } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Save, Trash2, Trophy, Upload, Shield } from "lucide-react";

interface AchievementItem {
  id?: string | number;
  title: string;
  organization: string;
  year: string;
  image_url: string;
  credential_url: string;
  display_order: number;
}

const AdminAchievements = () => {
  const { data: achievements, isLoading } = useAchievements();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<AchievementItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyItem: AchievementItem = {
    title: "",
    organization: "",
    year: "",
    image_url: "",
    credential_url: "",
    display_order: achievements?.length || 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: AchievementItem) => {
      console.log('Saving achievement:', item);
      if (item.id) {
        return achievementsApi.update(item.id, item);
      } else {
        return achievementsApi.create(item);
      }
    },
    onSuccess: (data) => {
      console.log('Save successful, returned data:', data);
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement saved!");
      setEditItem(null);
      setIsAdding(false);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => achievementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement deleted!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;

    try {
      const { url } = await uploadApi.upload(file);
      setEditItem({ ...editItem, image_url: url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Achievements & Certificates</h1>
          <p className="text-muted-foreground">Manage your awards and certifications</p>
        </div>
        <Button
          variant="hero"
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isAdding || editItem) && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{isAdding ? "Add New Achievement" : "Edit Achievement"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Award / Certificate Name"
                  value={editItem?.title || ""}
                  onChange={(e) => setEditItem({ ...editItem!, title: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Organization</label>
                <Input
                  placeholder="Issuing Organization"
                  value={editItem?.organization || ""}
                  onChange={(e) => setEditItem({ ...editItem!, organization: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Input
                  placeholder="2024"
                  value={editItem?.year || ""}
                  onChange={(e) => setEditItem({ ...editItem!, year: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Display Order</label>
                <Input
                  type="number"
                  value={editItem?.display_order || 0}
                  onChange={(e) => setEditItem({ ...editItem!, display_order: parseInt(e.target.value) })}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Certificate Image</label>
              <div className="flex gap-4 items-start">
                {editItem?.image_url && (
                  <img src={editItem.image_url} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
                )}
                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <Input
                    placeholder="Or paste image URL"
                    value={editItem?.image_url || ""}
                    onChange={(e) => setEditItem({ ...editItem!, image_url: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </div>

            {/* Credential URL */}
            <div>
              <label className="text-sm font-medium mb-2 block">Credential/Verification Link</label>
              <Input
                placeholder="https://verify.example.com/certificate/123"
                value={editItem?.credential_url || ""}
                onChange={(e) => setEditItem({ ...editItem!, credential_url: e.target.value })}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Add a link to verify this certificate</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="hero"
                onClick={() => saveMutation.mutate(editItem!)}
                disabled={saveMutation.isPending}
              >
                <Save className="w-4 h-4" />
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditItem(null);
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((item: any) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-secondary flex items-center justify-center">
                <Trophy className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.organization}</p>
              <p className="text-xs text-primary">{item.year}</p>
              {item.credential_url && (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                  <Shield className="w-3 h-3" />
                  <span>Has verification link</span>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditItem({
                      ...item,
                      organization: item.organization || "",
                      year: item.year || "",
                      image_url: item.image_url || "",
                      credential_url: item.credential_url || "",
                    });
                    setIsAdding(false);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {achievements?.length === 0 && !isAdding && (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No achievements yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
};

export default AdminAchievements;
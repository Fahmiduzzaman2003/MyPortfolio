import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coCurricularApi, uploadApi } from "@/lib/api";
import { useCoCurricular } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, Trash2, Users, Upload } from "lucide-react";

interface ActivityItem {
  id?: string | number;
  club_name: string;
  role: string;
  club_logo_url: string;
  display_order: number;
}

const AdminCoCurricular = () => {
  const { data: activities, isLoading } = useCoCurricular();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<ActivityItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyItem: ActivityItem = {
    club_name: "",
    role: "",
    club_logo_url: "",
    display_order: activities?.length || 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: ActivityItem) => {
      console.log('Saving co-curricular activity:', item);
      if (item.id) {
        return coCurricularApi.update(item.id, item);
      } else {
        return coCurricularApi.create(item);
      }
    },
    onSuccess: (data) => {
      console.log('Save successful, returned data:', data);
      queryClient.invalidateQueries({ queryKey: ["co_curricular"] });
      toast.success("Activity saved!");
      setEditItem(null);
      setIsAdding(false);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => coCurricularApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["co_curricular"] });
      toast.success("Activity deleted!");
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
      setEditItem({ ...editItem, club_logo_url: url });
      toast.success("Logo uploaded!");
    } catch (error) {
      toast.error("Failed to upload logo");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Co-Curricular Activities</h1>
          <p className="text-muted-foreground">Manage your club memberships and extracurricular involvement</p>
        </div>
        <Button
          variant="hero"
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Club
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isAdding || editItem) && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{isAdding ? "Add New Club" : "Edit Club"}</h3>
          <div className="space-y-4">
            {/* Club Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Club Name</label>
              <Input
                placeholder="e.g., Technical Club, Robotics Club"
                value={editItem?.club_name || ""}
                onChange={(e) => setEditItem({ ...editItem!, club_name: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Role</label>
              <Input
                placeholder="e.g., President, Member, Volunteer"
                value={editItem?.role || ""}
                onChange={(e) => setEditItem({ ...editItem!, role: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Club Logo</label>
              <div className="flex gap-4 items-start">
                {editItem?.club_logo_url && (
                  <img src={editItem.club_logo_url} alt="Logo" className="w-24 h-24 object-contain rounded-lg border border-border bg-white p-2" />
                )}
                <div className="flex-1 space-y-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Logo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <Input
                    placeholder="Or paste logo URL"
                    value={editItem?.club_logo_url || ""}
                    onChange={(e) => setEditItem({ ...editItem!, club_logo_url: e.target.value })}
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">Square logos (200x200px) work best</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="hero"
                onClick={() => saveMutation.mutate(editItem!)}
                disabled={saveMutation.isPending || !editItem?.club_name || !editItem?.role}
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activities?.map((item: any) => (
          <div key={item.id} className="bg-card border border-border rounded-xl p-4 group relative hover:border-primary/30 transition-all">
            <div className="flex flex-col items-center gap-3">
              {item.club_logo_url ? (
                <img src={item.club_logo_url} alt={item.club_name} className="w-20 h-20 object-contain rounded-lg" />
              ) : (
                <div className="w-20 h-20 bg-secondary/50 rounded-lg flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground/30" />
                </div>
              )}
              <div className="text-center w-full">
                <h4 className="font-semibold text-sm line-clamp-2">{item.club_name}</h4>
                <p className="text-xs text-primary mt-1">{item.role}</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  setEditItem({
                    ...item,
                    club_name: item.club_name || "",
                    role: item.role || "",
                    club_logo_url: item.club_logo_url || "",
                  });
                  setIsAdding(false);
                }}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {activities?.length === 0 && !isAdding && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No activities yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
};

export default AdminCoCurricular;

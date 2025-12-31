import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { codingPlatformsApi } from "@/lib/api";
import { useCodingPlatforms } from "@/hooks/usePortfolioData";
import { toast } from "sonner";

interface CodingPlatform {
  id: string;
  name: string;
  icon_name: string;
  url: string | null;
  problems_solved: number | null;
  rating: string | null;
  username: string | null;
  display_order: number | null;
}

const AdminCodingPlatforms = () => {
  const { data: platforms = [], isLoading } = useCodingPlatforms();
  const queryClient = useQueryClient();
  const [editingPlatforms, setEditingPlatforms] = useState<Record<string, CodingPlatform>>({});

  const saveMutation = useMutation({
    mutationFn: async (platform: CodingPlatform) => {
      return codingPlatformsApi.update(platform.id, platform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coding_platforms"] });
      toast.success("Platform updated successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      return codingPlatformsApi.create({
        name: "New Platform",
        icon_name: "code",
        problems_solved: 0,
        display_order: platforms.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coding_platforms"] });
      toast.success("Platform added");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => codingPlatformsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coding_platforms"] });
      toast.success("Platform deleted");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const getEditingPlatform = (platform: CodingPlatform): CodingPlatform => {
    return editingPlatforms[platform.id] || platform;
  };

  const updatePlatform = (id: string, field: keyof CodingPlatform, value: any) => {
    const original = platforms.find((p: CodingPlatform) => p.id === id);
    if (!original) return;
    
    setEditingPlatforms((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || original), [field]: value },
    }));
  };

  const handleSave = (platform: CodingPlatform) => {
    const edited = editingPlatforms[platform.id] || platform;
    saveMutation.mutate(edited);
    setEditingPlatforms((prev) => {
      const { [platform.id]: _, ...rest } = prev;
      return rest;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            Coding Platforms
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your competitive programming profiles
          </p>
        </div>
        <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Add Platform
        </Button>
      </div>

      <div className="grid gap-4">
        {(platforms as CodingPlatform[]).map((platform, index) => {
          const editedPlatform = getEditingPlatform(platform);
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{editedPlatform.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(platform.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform Name</Label>
                      <Input
                        value={editedPlatform.name}
                        onChange={(e) =>
                          updatePlatform(platform.id, "name", e.target.value)
                        }
                        placeholder="LeetCode"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Name</Label>
                      <Input
                        value={editedPlatform.icon_name}
                        onChange={(e) =>
                          updatePlatform(platform.id, "icon_name", e.target.value)
                        }
                        placeholder="leetcode, codeforces, codechef"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={editedPlatform.username || ""}
                        onChange={(e) =>
                          updatePlatform(platform.id, "username", e.target.value)
                        }
                        placeholder="your_username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Problems Solved</Label>
                      <Input
                        type="number"
                        value={editedPlatform.problems_solved || 0}
                        onChange={(e) =>
                          updatePlatform(
                            platform.id,
                            "problems_solved",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Input
                        value={editedPlatform.rating || ""}
                        onChange={(e) =>
                          updatePlatform(platform.id, "rating", e.target.value)
                        }
                        placeholder="1800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={editedPlatform.url || ""}
                        onChange={(e) =>
                          updatePlatform(platform.id, "url", e.target.value)
                        }
                        placeholder="https://leetcode.com/username"
                      />
                      {editedPlatform.url && (
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={editedPlatform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave(platform)} 
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {platforms.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No coding platforms added yet. Click "Add Platform" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCodingPlatforms;

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, uploadApi } from "@/lib/api";
import { useProjects } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, Trash2, FolderKanban, Upload, ExternalLink, Github } from "lucide-react";

interface ProjectItem {
  id?: string | number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  image_url: string;
  display_order: number;
}

const AdminProjects = () => {
  const { data: projects, isLoading } = useProjects();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<ProjectItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [techInput, setTechInput] = useState("");

  const emptyItem: ProjectItem = {
    title: "",
    description: "",
    tech_stack: [],
    github_url: "",
    live_url: "",
    image_url: "",
    display_order: projects?.length || 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: ProjectItem) => {
      if (item.id) {
        return projectsApi.update(item.id, item);
      } else {
        return projectsApi.create(item);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project saved!");
      setEditItem(null);
      setIsAdding(false);
      setTechInput("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted!");
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

  const addTech = () => {
    if (techInput.trim() && editItem) {
      setEditItem({
        ...editItem,
        tech_stack: [...editItem.tech_stack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (index: number) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        tech_stack: editItem.tech_stack.filter((_, i) => i !== index),
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button
          variant="hero"
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isAdding || editItem) && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{isAdding ? "Add New Project" : "Edit Project"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Project Name"
                  value={editItem?.title || ""}
                  onChange={(e) => setEditItem({ ...editItem!, title: e.target.value })}
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

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Project description..."
                value={editItem?.description || ""}
                onChange={(e) => setEditItem({ ...editItem!, description: e.target.value })}
                className="bg-secondary/50"
                rows={3}
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editItem?.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-primary/20 text-primary px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {tech}
                    <button onClick={() => removeTech(index)} className="hover:text-red-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  className="bg-secondary/50"
                />
                <Button type="button" variant="outline" onClick={addTech}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                <Input
                  placeholder="https://github.com/..."
                  value={editItem?.github_url || ""}
                  onChange={(e) => setEditItem({ ...editItem!, github_url: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Live Demo URL</label>
                <Input
                  placeholder="https://..."
                  value={editItem?.live_url || ""}
                  onChange={(e) => setEditItem({ ...editItem!, live_url: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Project Image</label>
              <div className="flex gap-4 items-start">
                {editItem?.image_url && (
                  <img src={editItem.image_url} alt="Preview" className="w-32 h-20 object-cover rounded-lg" />
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
                  setTechInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map((item: any) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tech_stack?.slice(0, 3).map((tech: string, index: number) => (
                  <span key={index} className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                    {tech}
                  </span>
                ))}
                {item.tech_stack && item.tech_stack.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{item.tech_stack.length - 3} more</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {item.github_url && (
                    <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {item.live_url && (
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditItem({
                        ...item,
                        tech_stack: item.tech_stack || [],
                        github_url: item.github_url || "",
                        live_url: item.live_url || "",
                        image_url: item.image_url || "",
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
          </div>
        ))}
      </div>

      {projects?.length === 0 && !isAdding && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No projects yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;

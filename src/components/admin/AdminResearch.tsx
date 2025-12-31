import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchApi } from "@/lib/api";
import { useResearch } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, Trash2, FlaskConical, ExternalLink } from "lucide-react";

interface ResearchItem {
  id?: string | number;
  title: string;
  abstract: string;
  venue: string;
  status: string;
  technologies: string[];
  paper_url: string;
  display_order: number;
}

const statusOptions = ["ongoing", "published", "idea", "completed"];

const AdminResearch = () => {
  const { data: research, isLoading } = useResearch();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<ResearchItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [techInput, setTechInput] = useState("");

  const emptyItem: ResearchItem = {
    title: "",
    abstract: "",
    venue: "",
    status: "ongoing",
    technologies: [],
    paper_url: "",
    display_order: research?.length || 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: ResearchItem) => {
      console.log('Saving research item:', item);
      console.log('Technologies:', item.technologies, 'Type:', typeof item.technologies, 'IsArray:', Array.isArray(item.technologies));
      if (item.id) {
        return researchApi.update(item.id, item);
      } else {
        return researchApi.create(item);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("Research saved!");
      setEditItem(null);
      setIsAdding(false);
      setTechInput("");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => researchApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("Research deleted!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const addTech = () => {
    if (techInput.trim() && editItem) {
      setEditItem({
        ...editItem,
        technologies: [...editItem.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (index: number) => {
    if (editItem) {
      setEditItem({
        ...editItem,
        technologies: editItem.technologies.filter((_, i) => i !== index),
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
          <h1 className="text-2xl font-bold mb-2">Research</h1>
          <p className="text-muted-foreground">Manage your research papers and projects with links</p>
        </div>
        <Button
          variant="hero"
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Research
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isAdding || editItem) && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{isAdding ? "Add New Research" : "Edit Research"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Research Title"
                  value={editItem?.title || ""}
                  onChange={(e) => setEditItem({ ...editItem!, title: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={editItem?.status || "ongoing"}
                  onChange={(e) => setEditItem({ ...editItem!, status: e.target.value })}
                  className="w-full h-10 px-3 bg-secondary/50 border border-input rounded-md text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Abstract</label>
              <Textarea
                placeholder="Research abstract..."
                value={editItem?.abstract || ""}
                onChange={(e) => setEditItem({ ...editItem!, abstract: e.target.value })}
                className="bg-secondary/50"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Venue / Conference</label>
              <Input
                placeholder="e.g., ICCIT-BD 2025"
                value={editItem?.venue || ""}
                onChange={(e) => setEditItem({ ...editItem!, venue: e.target.value })}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Conference, journal, or event where paper was accepted/published</p>
            </div>

            {/* Technologies */}
            <div>
              <label className="text-sm font-medium mb-2 block">Technologies / Tools</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editItem?.technologies.map((tech, index) => (
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
                <label className="text-sm font-medium mb-2 block">Paper URL (Research Paper Link)</label>
                <Input
                  placeholder="https://arxiv.org/abs/..."
                  value={editItem?.paper_url || ""}
                  onChange={(e) => setEditItem({ ...editItem!, paper_url: e.target.value })}
                  className="bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Link to your published paper or preprint</p>
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
      <div className="space-y-4">
        {research?.map((item: any) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl p-6 flex items-start justify-between"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === "published"
                        ? "bg-green-500/20 text-green-400"
                        : item.status === "ongoing"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.abstract}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.technologies?.slice(0, 4).map((tech: string, index: number) => (
                    <span key={index} className="bg-secondary text-xs px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                {item.paper_url && (
                  <a
                    href={item.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Paper
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditItem({
                    ...item,
                    abstract: item.abstract || "",
                    venue: item.venue || "",
                    technologies: item.technologies || [],
                    paper_url: item.paper_url || "",
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
        ))}

        {research?.length === 0 && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No research entries yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResearch;
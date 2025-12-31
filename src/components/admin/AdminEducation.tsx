import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "@/lib/api";
import { useEducation } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Save, Trash2, GraduationCap } from "lucide-react";

interface EducationItem {
  id?: string | number;
  degree: string;
  institution: string;
  duration: string;
  description: string;
  cgpa: string;
  cgpa_scale: string;
  semester_completed: string;
  core_courses: string;
  display_order: number;
}

const AdminEducation = () => {
  const { data: education, isLoading } = useEducation();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<EducationItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyItem: EducationItem = {
    degree: "",
    institution: "",
    duration: "",
    description: "",
    cgpa: "",
    cgpa_scale: "4",
    semester_completed: "",
    core_courses: "",
    display_order: education?.length || 0,
  };

  const saveMutation = useMutation({
    mutationFn: async (item: EducationItem) => {
      console.log('Saving education with data:', item);
      if (item.id) {
        return educationApi.update(item.id, item);
      } else {
        return educationApi.create(item);
      }
    },
    onSuccess: (data) => {
      console.log('Education saved successfully, returned data:', data);
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education saved!");
      setEditItem(null);
      setIsAdding(false);
    },
    onError: (error) => {
      console.error('Save education error:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => educationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education deleted!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Education</h1>
          <p className="text-muted-foreground">Manage your educational background</p>
        </div>
        <Button
          variant="hero"
          onClick={() => {
            setIsAdding(true);
            setEditItem(emptyItem);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {/* Edit/Add Form */}
      {(isAdding || editItem) && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{isAdding ? "Add New Education" : "Edit Education"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Degree</label>
                <Input
                  placeholder="B.Sc. in Computer Science"
                  value={editItem?.degree || ""}
                  onChange={(e) => setEditItem({ ...editItem!, degree: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Institution</label>
                <Input
                  placeholder="University Name"
                  value={editItem?.institution || ""}
                  onChange={(e) => setEditItem({ ...editItem!, institution: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Input
                  placeholder="2020 - 2024"
                  value={editItem?.duration || ""}
                  onChange={(e) => setEditItem({ ...editItem!, duration: e.target.value })}
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
                placeholder="Additional details about your education..."
                value={editItem?.description || ""}
                onChange={(e) => setEditItem({ ...editItem!, description: e.target.value })}
                className="bg-secondary/50"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">CGPA</label>
                <Input
                  placeholder="3.8"
                  value={editItem?.cgpa || ""}
                  onChange={(e) => setEditItem({ ...editItem!, cgpa: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Out of (Scale)</label>
                <Input
                  placeholder="4 or 10"
                  value={editItem?.cgpa_scale || ""}
                  onChange={(e) => setEditItem({ ...editItem!, cgpa_scale: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Semesters</label>
                <Input
                  placeholder="6/8 semesters"
                  value={editItem?.semester_completed || ""}
                  onChange={(e) => setEditItem({ ...editItem!, semester_completed: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Core Courses Passed</label>
              <Textarea
                placeholder="Data Structures, Algorithms, Machine Learning, Database Systems"
                value={editItem?.core_courses || ""}
                onChange={(e) => setEditItem({ ...editItem!, core_courses: e.target.value })}
                className="bg-secondary/50"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">Separate courses with commas</p>
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

      {/* List */}
      <div className="space-y-4">
        {education?.map((item: any) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl p-6 flex items-start justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{item.degree}</h3>
                <p className="text-muted-foreground">{item.institution}</p>
                <p className="text-sm text-primary">{item.duration}</p>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditItem({
                    ...item,
                    degree: item.degree || "",
                    institution: item.institution || "",
                    duration: item.duration || "",
                    description: item.description || "",
                    cgpa: item.cgpa || "",
                    cgpa_scale: item.cgpa_scale || "",
                    semester_completed: item.semester_completed || "",
                    core_courses: item.core_courses || "",
                    display_order: item.display_order || 0,
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

        {education?.length === 0 && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No education entries yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEducation;
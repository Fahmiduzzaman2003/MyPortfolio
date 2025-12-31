import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { skillsApi, uploadApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Save, Trash2, Wrench, X, LayoutGrid, Upload } from "lucide-react";
import { SkillCategory } from "@/types/skills"; // Adjust path

// Types for local state
interface NewSkillState {
  name: string;
  level: number;
}

interface NewCategoryState {
  name: string;
  icon: string;
  logo_url: string;
}

const useSkillCategories = () => {
  return useQuery<SkillCategory[]>({
    queryKey: ["skillCategories"],
    queryFn: skillsApi.getAll,
  });
};

const AdminSkills: React.FC = () => {
  const { data: categories, isLoading } = useSkillCategories();
  const queryClient = useQueryClient();
  
  // State
  const [newCategory, setNewCategory] = useState<NewCategoryState>({ name: "", icon: "", logo_url: "" });
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [categoryLogoFile, setCategoryLogoFile] = useState<File | null>(null);
  const [categoryLogoPreview, setCategoryLogoPreview] = useState<string>("");
  
  // Stores temporary input for new skills keyed by category ID
  const [newSkills, setNewSkills] = useState<Record<number, NewSkillState>>({});

  // --- API Mutations ---

  const addCategoryMutation = useMutation({
    mutationFn: async (category: NewCategoryState) => {
      let logoUrl = category.logo_url;
      
      // Upload logo if provided
      if (categoryLogoFile) {
        const uploadResponse = await uploadApi.upload(categoryLogoFile);
        logoUrl = uploadResponse.url;
      }
      
      return skillsApi.createCategory({ 
        ...category, 
        logo_url: logoUrl,
        display_order: (categories?.length || 0) + 1 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast.success("Category created successfully");
      setNewCategory({ name: "", icon: "", logo_url: "" });
      setIsAddingCategory(false);
      setCategoryLogoFile(null);
      setCategoryLogoPreview("");
    },
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => skillsApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast.success("Category deleted");
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: ({ categoryId, name, level }: { categoryId: number; name: string; level: number }) =>
      skillsApi.create({ category_id: categoryId, name, level }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast.success("Skill added");
      // Reset input for this category
      setNewSkills((prev) => ({ 
        ...prev, 
        [variables.categoryId]: { name: "", level: 85 } 
      }));
    },
    onError: (error: Error) => toast.error(`Failed to save: ${error.message}`),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillCategories"] });
      toast.success("Skill removed");
    },
  });

  const handleCategoryLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading Database Data...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Skills Management</h1>
          <p className="text-muted-foreground">
            Create categories (e.g., "Programming Languages", "Databases") and add skills with percentages.
          </p>
        </div>
        <Button variant="default" onClick={() => setIsAddingCategory(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-in slide-in-from-top-4 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" /> New Category Details
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Category Name (e.g. Programming Languages)"
                value={newCategory.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="bg-secondary/50 flex-1"
              />
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Category Logo (Optional)</label>
              <div className="flex gap-4 items-start">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors text-center w-32">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {categoryLogoFile ? categoryLogoFile.name : "Upload Logo"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleCategoryLogoChange}
                    className="hidden"
                  />
                </label>

                {categoryLogoPreview && (
                  <div className="w-20 h-20 border border-border rounded-lg overflow-hidden bg-white">
                    <img
                      src={categoryLogoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => addCategoryMutation.mutate(newCategory)}>
                <Save className="w-4 h-4 mr-2" /> Save Category
              </Button>
              <Button variant="ghost" onClick={() => {
                setIsAddingCategory(false);
                setCategoryLogoFile(null);
                setCategoryLogoPreview("");
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories?.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-xl p-6 relative flex flex-col h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {category.logo_url ? (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-border/50 p-1 flex-shrink-0">
                    <img src={category.logo_url} alt={category.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                )}
                {category.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={() => {
                   if(window.confirm(`Delete "${category.name}" and all its skills?`)) 
                     deleteCategoryMutation.mutate(category.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* List of Existing Skills */}
            <div className="flex-1 space-y-3 mb-6">
              {category.skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between bg-secondary/30 px-3 py-2 rounded-md group hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-sm">{skill.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {skill.level}%
                    </span>
                    <button
                      onClick={() => deleteSkillMutation.mutate(skill.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {category.skills?.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">No skills added yet.</p>
              )}
            </div>

            {/* Add New Skill Input */}
            <div className="bg-secondary/20 p-3 rounded-lg mt-auto">
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Add New Skill</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Name (e.g. Python)"
                  value={newSkills[category.id]?.name || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewSkills({
                      ...newSkills,
                      [category.id]: { 
                        name: e.target.value, 
                        level: newSkills[category.id]?.level || 85 
                      },
                    })
                  }
                  className="bg-background h-9 text-sm"
                />
                <div className="relative w-24">
                   <Input
                    type="number"
                    min={0}
                    max={100}
                    value={newSkills[category.id]?.level || 85}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewSkills({
                        ...newSkills,
                        [category.id]: { 
                          name: newSkills[category.id]?.name || "", 
                          level: parseInt(e.target.value) 
                        },
                      })
                    }
                    className="bg-background h-9 text-sm pr-6"
                  />
                  <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">%</span>
                </div>
                <Button
                  size="sm"
                  className="h-9 px-3"
                  disabled={!newSkills[category.id]?.name}
                  onClick={() =>
                    addSkillMutation.mutate({
                      categoryId: category.id,
                      name: newSkills[category.id]?.name || "",
                      level: newSkills[category.id]?.level || 85,
                    })
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkills;
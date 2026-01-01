import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi, uploadApi } from "@/lib/api";
import { useProfile } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileText, Download, ExternalLink, Trash2 } from "lucide-react";

const AdminCV = () => {
  const { data: profile, isLoading } = useProfile();
  const queryClient = useQueryClient();
  const [cvUrl, setCvUrl] = useState("");

  useEffect(() => {
    if (profile?.cv_url) {
      setCvUrl(profile.cv_url);
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (url: string) => {
      if (!url.trim()) {
        throw new Error("Please enter a valid URL");
      }
      
      // Convert Google Drive view links to direct download links
      let finalUrl = url.trim();
      if (finalUrl.includes('drive.google.com/file/d/')) {
        const fileIdMatch = finalUrl.match(/\/file\/d\/([^\/]+)/);
        if (fileIdMatch) {
          finalUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
          toast.info("Converted to Google Drive download link");
        }
      }
      
      // Get current profile data first, then only update cv_url
      const currentProfile = profile || {};
      const updateData = {
        full_name: currentProfile.full_name || '',
        tagline: currentProfile.tagline || '',
        short_intro: currentProfile.short_intro || '',
        bio: currentProfile.bio || '',
        location: currentProfile.location || '',
        email: currentProfile.email || '',
        phone: currentProfile.phone || '',
        linkedin_url: currentProfile.linkedin_url || '',
        github_url: currentProfile.github_url || '',
        whatsapp_number: currentProfile.whatsapp_number || '',
        profile_photo_url: currentProfile.profile_photo_url || '',
        cv_url: finalUrl,
        availability_text: currentProfile.availability_text || 'Open to work',
        roles: currentProfile.roles || [],
        stats: currentProfile.stats || []
      };
      
      console.log('Saving CV URL:', finalUrl);
      const response = await profileApi.update(updateData);
      return { ...response, cv_url: finalUrl };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("CV saved successfully!");
      console.log('CV saved, URL:', data.cv_url);
    },
    onError: (error) => {
      console.error('CV save error:', error);
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      const { url } = await uploadApi.upload(file);
      setCvUrl(url);
      saveMutation.mutate(url);
    } catch (error) {
      toast.error("Failed to upload CV");
    }
  };

  const handleRemove = () => {
    setCvUrl("");
    saveMutation.mutate("");
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">CV / Resume</h1>
        <p className="text-muted-foreground">Upload and manage your CV for download. Visitors can download this from the portfolio.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        {cvUrl ? (
          <div className="space-y-4">
            {/* Current CV */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Current CV</p>
                <p className="text-sm text-muted-foreground truncate max-w-md">{cvUrl}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={cvUrl} download>
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={handleRemove}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Update CV */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-2">Update CV</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload New PDF</span>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-muted-foreground text-sm self-center">or</span>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Paste PDF URL"
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Button variant="outline" onClick={() => saveMutation.mutate(cvUrl)}>
                    Save URL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-semibold mb-2">No CV Uploaded</h3>
            <p className="text-muted-foreground mb-6">
              Upload your CV so visitors can download it from your portfolio
            </p>
            <div className="flex flex-col items-center gap-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload PDF</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
              <span className="text-muted-foreground text-sm">or paste a URL</span>
              <div className="flex gap-2 w-full max-w-md">
                <Input
                  placeholder="Paste PDF URL"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  className="bg-secondary/50"
                />
                <Button variant="outline" onClick={() => saveMutation.mutate(cvUrl)} disabled={!cvUrl}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
        <h4 className="font-medium mb-2">Tips for your CV:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use a clean, professional design</li>
          <li>• Keep it to 1-2 pages</li>
          <li>• Include your latest projects and skills</li>
          <li>• Add your LinkedIn profile URL</li>
          <li>• Use PDF format for best compatibility</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCV;
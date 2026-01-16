import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, LogOut, Camera, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupPhoto {
  id: string;
  group_name: string;
  photo_url: string | null;
}

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<GroupPhoto[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("group_photos")
      .select("*")
      .order("group_name");

    if (data) {
      setGroups(data);
    }
    setLoadingGroups(false);
  };

  const handleFileUpload = async (groupName: string, file: File) => {
    setUploading(groupName);

    const fileExt = file.name.split(".").pop();
    const fileName = `${groupName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("group-photos")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload Failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(null);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("group-photos")
      .getPublicUrl(fileName);

    // Update database
    const { error: dbError } = await supabase
      .from("group_photos")
      .update({
        photo_url: urlData.publicUrl,
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
      })
      .eq("group_name", groupName);

    if (dbError) {
      toast({
        title: "Database Update Failed",
        description: dbError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Photo Uploaded! 📸",
        description: `${groupName} photo updated successfully`,
      });
      fetchGroups();
    }

    setUploading(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingGroups) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8 card-shadow mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">
                Manage group photos for BSCS Reunion
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
            <p>
              <strong>Logged in as:</strong> {user.email}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 card-shadow">
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Student Group Photos
          </h2>

          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
              >
                {/* Preview */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {group.photo_url ? (
                    <img
                      src={group.photo_url}
                      alt={group.group_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold">{group.group_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.photo_url ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-3 h-3" /> Photo uploaded
                      </span>
                    ) : (
                      "No photo yet"
                    )}
                  </p>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(group.group_name, file);
                    }}
                    disabled={uploading === group.group_name}
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
                    {uploading === group.group_name ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

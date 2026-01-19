import { Camera, Image, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SkeletonPhoto } from "@/components/ui/skeleton-card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface GalleryPhoto {
  id: string;
  photo_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
}

const categories = [
  { name: "Class Days", icon: "📚" },
  { name: "Events", icon: "🎉" },
  { name: "Trips", icon: "🚌" },
  { name: "Farewell", icon: "🎓" },
  { name: "Other", icon: "📷" },
];

const MemoriesSection = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setPhotos(data);
    }
    setLoading(false);
  };

  const getPhotoCount = (categoryName: string) => {
    return photos.filter((p) => p.category === categoryName).length;
  };

  const filteredPhotos = selectedCategory
    ? photos.filter((p) => p.category === selectedCategory)
    : photos;

  return (
    <section id="memories" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Photo Gallery</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            Memories Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Captured moments that tell the story of our incredible journey together
          </p>
        </AnimatedSection>

        {/* Category Filter */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((category) => {
            const count = getPhotoCount(category.name);
            const isSelected = selectedCategory === category.name;
            
            return (
              <StaggerItem key={category.name}>
                <motion.button
                  onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                  className={`w-full glass-card rounded-2xl p-6 card-shadow cursor-pointer text-left transition-all duration-300 ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  whileHover={{ y: -8, boxShadow: "var(--shadow-hover)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="font-display text-lg font-semibold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {count} {count === 1 ? "photo" : "photos"}
                  </p>
                </motion.button>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Gallery */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <SkeletonPhoto key={i} />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <AnimatedSection>
            <motion.div 
              className="glass-card rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Image className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="font-display text-2xl font-semibold mb-3">
                {selectedCategory ? `No ${selectedCategory} photos yet` : "Gallery Coming Soon"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're collecting precious memories from our batch. Share your photos to be featured here!
              </p>
            </motion.div>
          </AnimatedSection>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer card-shadow"
                  whileHover={{ y: -8, boxShadow: "var(--shadow-hover)" }}
                >
                  <motion.img
                    src={photo.photo_url}
                    alt={photo.title || "Gallery photo"}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium truncate">{photo.title || "Untitled"}</p>
                      {photo.category && (
                        <p className="text-white/70 text-sm">{photo.category}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Photo Modal */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedPhoto && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={selectedPhoto.photo_url}
                  alt={selectedPhoto.title || "Gallery photo"}
                  className="w-full max-h-[80vh] object-contain"
                />
                {(selectedPhoto.title || selectedPhoto.description) && (
                  <div className="p-4 bg-card">
                    {selectedPhoto.title && (
                      <h3 className="font-display text-lg font-semibold">{selectedPhoto.title}</h3>
                    )}
                    {selectedPhoto.description && (
                      <p className="text-muted-foreground mt-1">{selectedPhoto.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default MemoriesSection;

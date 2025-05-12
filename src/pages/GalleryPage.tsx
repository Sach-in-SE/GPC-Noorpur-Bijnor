
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const galleryCategories = [
  { value: "all", label: "All Categories" },
  { value: "campus", label: "Campus" },
  { value: "events", label: "Events" },
  { value: "students", label: "Students" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "facilities", label: "Facilities" },
];

const GalleryPage = () => {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");
  const [selectedImageDescription, setSelectedImageDescription] = useState<string | null>(null);
  
  // Fetch gallery items
  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });

  // Filter gallery items by category
  const filteredItems = galleryItems?.filter(item => 
    categoryFilter === "all" || item.category === categoryFilter
  );

  // Handle errors
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load gallery. Please try again later.",
    });
  }

  // Open lightbox with selected image
  const openLightbox = (imageUrl: string, title: string, description: string | null) => {
    setSelectedImage(imageUrl);
    setSelectedImageTitle(title);
    setSelectedImageDescription(description);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedImageTitle("");
    setSelectedImageDescription(null);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Photo Gallery</h1>
        <p className="text-gray-600 mt-2">
          Explore our campus life through images
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex justify-end mb-6">
        <Select 
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {galleryCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
              onClick={() => openLightbox(item.image_url, item.title, item.description)}
            >
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs font-medium truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {categoryFilter !== "all" 
              ? `There are no images in the ${galleryCategories.find(cat => cat.value === categoryFilter)?.label} category.` 
              : "There are no images in the gallery yet."}
          </p>
        </div>
      )}

      {/* Lightbox dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden">
          <DialogHeader className="absolute top-0 right-0 z-10 p-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/50 border-0 text-white hover:bg-black/70"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="flex flex-col">
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[80vh]">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt={selectedImageTitle} 
                  className="max-h-[80vh] max-w-full object-contain" 
                />
              )}
            </div>
            
            {(selectedImageTitle || selectedImageDescription) && (
              <div className="p-4 bg-white">
                <DialogTitle className="text-lg">{selectedImageTitle}</DialogTitle>
                {selectedImageDescription && (
                  <DialogDescription className="mt-2">
                    {selectedImageDescription}
                  </DialogDescription>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;

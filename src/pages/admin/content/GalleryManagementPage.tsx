
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  ImagePlus, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  Grid3X3, 
  Grid2X2,
  Loader2,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const galleryCategories = [
  "campus",
  "events",
  "students",
  "sports",
  "cultural",
  "facilities",
];

// Maximum image dimensions
const MAX_WIDTH = 1200;
const MAX_SIZE_MB = 2;

// Validation schema for gallery form
const galleryFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  is_published: z.boolean().default(true),
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

const GalleryManagementPage = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      is_published: true,
    },
  });

  const { data: galleryItems, isLoading, error, refetch } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select(`
          *,
          uploader:uploaded_by (
            full_name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredItems = galleryItems?.filter(item => {
    // Apply text search
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = async (id: string) => {
    try {
      // Get the image URL to delete from storage
      const { data: imageData } = await supabase
        .from("gallery")
        .select("image_url")
        .eq("id", id)
        .single();
      
      if (imageData && imageData.image_url) {
        // Extract the path from the URL
        const urlParts = imageData.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const path = `gallery-images/${fileName}`;
        
        // Delete the file from storage
        await supabase.storage
          .from('gallery-images')
          .remove([path]);
      }
      
      // Delete the gallery item record
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
      });
    }
  };

  // Image optimization function
  const optimizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > MAX_WIDTH) {
          const scaleFactor = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = height * scaleFactor;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with quality for JPEG images
        const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(blob);
          },
          file.type,
          isJpeg ? 0.85 : undefined // Use 85% quality for JPEG
        );
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
      });
      return;
    }
    
    // Check file size (max 5MB before optimization)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Image must be less than ${MAX_SIZE_MB}MB.`,
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedImage) return "";
    
    setUploadingImage(true);
    
    try {
      // Optimize image
      const optimizedBlob = await optimizeImage(selectedImage);
      
      // Create a new file with optimized blob
      const optimizedFile = new File(
        [optimizedBlob], 
        selectedImage.name, 
        { type: selectedImage.type }
      );
      
      // Generate unique filename
      const fileExt = selectedImage.name.split('.').pop()?.toLowerCase();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery-images/${fileName}`;
      
      // Upload the optimized file
      const { error: uploadError, data } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
      });
      return "";
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload.",
      });
      return;
    }

    try {
      // Upload the image first
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image. Please try again.",
        });
        return;
      }
      
      // Save gallery item to database
      const { error } = await supabase
        .from("gallery")
        .insert({
          title: values.title,
          description: values.description || null,
          image_url: imageUrl,
          category: values.category,
          is_published: values.is_published,
          uploaded_by: profile?.id,
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item has been added successfully",
      });
      
      // Reset form and state
      form.reset();
      setPreviewUrl(null);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsAddDialogOpen(false);
      
      // Refresh gallery data
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error adding gallery item:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add gallery item. Please try again.",
      });
    }
  };

  // Display error notification if query fails
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load gallery items. Please refresh the page.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? (
              <Grid2X2 className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search gallery items..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {galleryCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredItems && filteredItems.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  {!item.is_published && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        Draft
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {item.category && (
                    <span className="text-xs font-normal inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  )}
                </CardHeader>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => window.open(item.image_url, "_blank")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this image?")) {
                          handleDeleteItem(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        {item.category && (
                          <span className="text-xs inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 mt-1">
                            {item.category}
                          </span>
                        )}
                        {!item.is_published && (
                          <span className="ml-2 text-xs inline-block px-2 py-1 rounded-full bg-amber-100 text-amber-800 mt-1">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => window.open(item.image_url, "_blank")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this image?")) {
                              handleDeleteItem(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 flex-grow">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()} by {item.uploader?.full_name || "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No images found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {categoryFilter !== "all" 
              ? `No ${categoryFilter} images found.` 
              : searchQuery 
                ? "No images match your search query." 
                : "Get started by adding a new image to the gallery."}
          </p>
          <Button 
            className="mt-6" 
            variant="outline" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add New Image
          </Button>
        </div>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add to Gallery</DialogTitle>
            <DialogDescription>
              Upload a new image to the gallery. High quality images work best.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    previewUrl ? 'border-primary' : 'border-gray-300'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-[200px] mx-auto rounded" 
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewUrl(null);
                          setSelectedImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <ImagePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WebP up to {MAX_SIZE_MB}MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Image title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {galleryCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description of the image"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Publish immediately</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    form.reset();
                    setPreviewUrl(null);
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={uploadingImage}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!selectedImage || uploadingImage}
                >
                  {uploadingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload & Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagementPage;

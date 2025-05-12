import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Loader2, Upload, Paperclip, File, FileText, X, Image } from "lucide-react";
import { format } from "date-fns";

// Define strict types for notice categories 
// Updated to match database constraints
type NoticeCategory = "Academic" | "Examination" | "Event" | "Workshop/Placement" | "General";

// Max file size for uploads (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const noticeFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  // Update this enum to match exact values in database constraint
  category: z.enum(["Academic", "Examination", "Event", "Workshop/Placement", "General"]),
  publish_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const isCreating = !id || id === "create";
  
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General" as NoticeCategory,
      publish_date: format(new Date(), "yyyy-MM-dd"),
      expiry_date: "",
    },
  });

  const { data: notice, isLoading, error } = useQuery({
    queryKey: ["notice", id],
    queryFn: async () => {
      if (isCreating) return null;
      
      const { data, error } = await supabase
        .from("notices")
        .select(`
          *,
          creator:created_by (
            id,
            full_name,
            email
          )
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !isCreating,
  });

  useEffect(() => {
    if (notice) {
      form.reset({
        title: notice.title,
        content: notice.content,
        category: notice.category as NoticeCategory,
        publish_date: notice.publish_date ? format(new Date(notice.publish_date), "yyyy-MM-dd") : undefined,
        expiry_date: notice.expiry_date ? format(new Date(notice.expiry_date), "yyyy-MM-dd") : undefined,
      });
      
      if (notice.attachments && notice.attachments.length > 0) {
        setAttachments(notice.attachments);
      }
    }
  }, [notice, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only JPG, PNG, and PDF files are allowed",
      });
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File must be less than 5MB",
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (document.getElementById('file-upload')) {
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    }
  };

  const handleRemoveAttachment = async (fileUrl: string) => {
    try {
      // Extract the path from the URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const path = `notice-attachments/${fileName}`;
      
      // Delete the file from storage
      await supabase.storage
        .from('notice-attachments')
        .remove([path]);
      
      // Update attachments list
      const updatedAttachments = attachments.filter(url => url !== fileUrl);
      setAttachments(updatedAttachments);
      
      // Update the notice record if it exists
      if (!isCreating) {
        await supabase
          .from("notices")
          .update({ attachments: updatedAttachments })
          .eq("id", id);
      }
      
      toast({
        title: "Success",
        description: "File removed successfully",
      });
    } catch (err) {
      console.error("Error removing file:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove file",
      });
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    
    setUploadingFile(true);
    
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `notice-attachments/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('notice-attachments')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('notice-attachments')
        .getPublicUrl(filePath);
        
      // Add to attachments list
      const newUrl = data.publicUrl;
      setAttachments([...attachments, newUrl]);
      
      // Reset file selection
      setSelectedFile(null);
      setFilePreview(null);
      if (document.getElementById('file-upload')) {
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }
      
      return newUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const onSubmit = async (values: NoticeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // First upload any new file if selected
      if (selectedFile) {
        await uploadFile();
      }
      
      // Log the values to help debug
      console.log("Submitting notice with values:", values);
      
      const noticeData = {
        title: values.title,
        content: values.content,
        category: values.category,
        publish_date: values.publish_date || new Date().toISOString(),
        expiry_date: values.expiry_date || null,
        updated_at: new Date().toISOString(),
        attachments: attachments,
      };
      
      if (isCreating) {
        const { data, error } = await supabase
          .from("notices")
          .insert({
            ...noticeData,
            created_by: profile!.id,
            is_approved: profile?.role === "admin" ? true : false,
            approved_by: profile?.role === "admin" ? profile.id : null,
            approved_at: profile?.role === "admin" ? new Date().toISOString() : null,
          })
          .select();
          
        if (error) {
          console.error("Error saving notice:", error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Notice has been created successfully",
        });
        navigate("/admin/notices");
      } else {
        const { error } = await supabase
          .from("notices")
          .update(noticeData)
          .eq("id", id);
          
        if (error) {
          console.error("Error updating notice:", error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Notice has been updated successfully",
        });
        navigate("/admin/notices");
      }
    } catch (err: any) {
      console.error("Error saving notice:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to save notice. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2">Failed to load notice data. Please try again.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/admin/notices")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Helper function to get the file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    
    if (extension === 'pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/notices">Notices</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{isCreating ? "Create Notice" : "Edit Notice"}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold mt-2">
            {isCreating ? "Create New Notice" : `Edit: ${notice?.title || "Notice"}`}
          </h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/notices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notices
        </Button>
      </div>

      {isLoading && !isCreating ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Create New Notice" : "Edit Notice"}</CardTitle>
            <CardDescription>
              {isCreating 
                ? "Create a new notice that will be visible to everyone on the website." 
                : "Update the notice details below."}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter notice title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Examination">Examination</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Placement">Placement</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="publish_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Date</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input type="date" {...field} value={field.value || ''} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          When this notice should be published
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input type="date" {...field} value={field.value || ''} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          When this notice should expire
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Attachment</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-lg p-4">
                        {selectedFile ? (
                          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              {getFileIcon(selectedFile.name)}
                              <span className="text-sm truncate max-w-[200px] ml-2">{selectedFile.name}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={handleRemoveFile}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 text-center">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF, JPG, PNG (Max 5MB)
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              Select File
                            </Button>
                          </div>
                        )}
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a file to attach to this notice
                    </FormDescription>
                  </FormItem>
                </div>
                
                {/* Existing attachments */}
                {attachments && attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Attached Files</h4>
                    <div className="space-y-2">
                      {attachments.map((fileUrl, index) => {
                        const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                        
                        return (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              {isImage ? (
                                <img 
                                  src={fileUrl} 
                                  alt="Attachment preview" 
                                  className="h-8 w-8 object-cover mr-2 rounded" 
                                />
                              ) : (
                                getFileIcon(fileName)
                              )}
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-blue-600 hover:underline truncate max-w-[200px] ml-2"
                              >
                                {fileName}
                              </a>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveAttachment(fileUrl)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter notice content"
                          className="min-h-40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/notices")}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  {selectedFile && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={uploadFile}
                      disabled={uploadingFile || isSubmitting}
                    >
                      {uploadingFile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Paperclip className="mr-2 h-4 w-4" />
                      Upload Attachment
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting || uploadingFile}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isCreating ? "Create Notice" : "Update Notice"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default NoticeDetailPage;

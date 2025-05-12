
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, Search, Trash2, Edit, Download, FileText, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const NoticesPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const { data: notices, isLoading, error, refetch } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      // Update the query to be more explicit about the relationship
      const { data, error } = await supabase
        .from("notices")
        .select(`
          id,
          title,
          content,
          category,
          publish_date,
          expiry_date,
          is_approved,
          created_at,
          created_by,
          approved_at,
          approved_by,
          attachments,
          creator:profiles!created_by(full_name, email)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredNotices = notices?.filter(notice => {
    // Apply text search
    const matchesSearch = 
      notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || notice.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Notice has been deleted successfully",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting notice:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notice. Please try again.",
      });
    }
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load notices. Please refresh the page.",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notice Management</h1>
        <Button onClick={() => navigate("/admin/notices/create")}>
          <FileText className="mr-2 h-4 w-4" />
          Create Notice
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search notices by title or content..."
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
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Examination">Examination</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Placement">Placement</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading notices...
                </TableCell>
              </TableRow>
            ) : filteredNotices && filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">
                    {notice.title || "Untitled Notice"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {notice.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {notice.creator?.full_name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {notice.publish_date
                      ? new Date(notice.publish_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {notice.is_approved 
                      ? <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Published</span>
                      : <span className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/notices/${notice.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this notice?")) {
                            handleDeleteNotice(notice.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No notices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NoticesPage;

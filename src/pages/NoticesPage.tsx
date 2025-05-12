
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Calendar, Download } from "lucide-react";
import { format } from "date-fns";

const NoticesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: notices, isLoading } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select(`
          id,
          title,
          content,
          category,
          publish_date,
          expiry_date,
          attachments,
          created_at,
          creator:profiles!created_by(full_name)
        `)
        .eq("is_approved", true)
        .lte("publish_date", new Date().toISOString())
        .or(`expiry_date.gt.${new Date().toISOString()},expiry_date.is.null`)
        .order("publish_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching notices:", error);
        throw error;
      }
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

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">College Notices</h1>
        <p className="text-gray-600">Stay updated with the latest announcements and information</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
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

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
                <p className="mt-2">Loading notices...</p>
              </div>
            </div>
          ) : filteredNotices && filteredNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                <Card key={notice.id} className="overflow-hidden">
                  <div className={`h-2 ${getCategoryColor(notice.category)}`}></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mb-2">
                          {notice.category}
                        </span>
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{notice.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 text-xs text-gray-500 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(notice.publish_date || notice.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <div>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          <Download className="h-3 w-3 mr-1" /> Attachment
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-md">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search criteria or check back later.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
                <p className="mt-2">Loading notices...</p>
              </div>
            </div>
          ) : filteredNotices && filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <div key={notice.id} className="border rounded-md p-4 hover:border-primary transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {notice.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(notice.publish_date || notice.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="font-medium text-lg">{notice.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-md">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search criteria or check back later.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get color based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Academic":
      return "bg-blue-500";
    case "Examination":
      return "bg-purple-500";
    case "Event":
      return "bg-green-500";
    case "Placement":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export default NoticesPage;

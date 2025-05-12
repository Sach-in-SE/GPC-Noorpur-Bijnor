
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, Filter, Download, File, FileText, Image } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Number of notices per page
const ITEMS_PER_PAGE = 10;

const PublicNoticesPage = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);
  
  // Fetch notices from Supabase
  const { data: notices, isLoading, error } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const today = new Date().toISOString();
      
      // Fetch published notices that are not expired
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
          created_by,
          creator:profiles!created_by(full_name)
        `)
        .eq("is_approved", true)
        .lte("publish_date", today)
        .or(`expiry_date.gt.${today},expiry_date.is.null`)
        .order("publish_date", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Handle errors
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load notices. Please try again later.",
    });
  }

  // Filter notices based on search and category
  const filteredNotices = notices?.filter(notice => {
    // Apply text search
    const matchesSearch = searchQuery === "" || 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || notice.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = filteredNotices ? Math.ceil(filteredNotices.length / ITEMS_PER_PAGE) : 0;
  const paginatedNotices = filteredNotices?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Handle notice expansion toggle
  const toggleNoticeExpansion = (noticeId: string) => {
    if (expandedNotice === noticeId) {
      setExpandedNotice(null);
    } else {
      setExpandedNotice(noticeId);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Get file type icon based on extension
  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    
    if (extension === 'pdf') {
      return <FileText className="h-4 w-4" />;
    }
    
    return <File className="h-4 w-4" />;
  };

  // Get file name from URL
  const getFileName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Notice Board</h1>
        <p className="text-gray-600 mt-2">
          Stay updated with the latest announcements and news
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-500" />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Examination">Examination</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Placement">Placement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notice list */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : paginatedNotices && paginatedNotices.length > 0 ? (
          // Notice cards
          paginatedNotices.map((notice) => (
            <Card key={notice.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div>
                    <CardTitle 
                      className="text-xl cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleNoticeExpansion(notice.id)}
                    >
                      {notice.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Posted on {formatDate(notice.publish_date || notice.created_at)}
                      {notice.creator?.full_name && ` by ${notice.creator.full_name}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                      ${notice.category === 'Academic' ? 'bg-blue-100 text-blue-800' : 
                      notice.category === 'Examination' ? 'bg-purple-100 text-purple-800' :
                      notice.category === 'Event' ? 'bg-green-100 text-green-800' :
                      notice.category === 'Placement' ? 'bg-amber-100 text-amber-800' : 
                      'bg-gray-100 text-gray-800'}`}
                    >
                      {notice.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleNoticeExpansion(notice.id)}
                    >
                      {expandedNotice === notice.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedNotice === notice.id && (
                <CardContent className="pt-0">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{notice.content}</div>
                  </div>

                  {/* Attachments */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Attachments</h4>
                      <div className="flex flex-wrap gap-2">
                        {notice.attachments.map((url: string, index: number) => {
                          const fileName = getFileName(url);
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                          return (
                            <div 
                              key={index} 
                              className="flex items-center border rounded-md p-2 bg-gray-50"
                            >
                              {isImage ? (
                                <div className="mr-2">
                                  <img 
                                    src={url} 
                                    alt="Preview" 
                                    className="h-8 w-8 object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <div className="mr-2">
                                  {getFileIcon(url)}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-xs truncate max-w-[150px]">
                                  {fileName}
                                </span>
                                <a 
                                  href={url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {categoryFilter !== "all" 
                ? `There are no ${categoryFilter} notices available.` 
                : searchQuery 
                  ? "No notices match your search query." 
                  : "There are no notices available at this time."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <Button
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(index + 1)}
                    className="w-9 h-9"
                  >
                    {index + 1}
                  </Button>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PublicNoticesPage;

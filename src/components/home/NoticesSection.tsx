
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface Notice {
  id: number;
  title: string;
  date: string;
  category: string;
}

const NoticesSection = () => {
  // Notices data
  const notices = [
    {
      id: 1,
      title: "Admission Open for 2025-26 Academic Year",
      date: "July 05, 2025",
      category: "General",
    },
    {
      id: 2,
      title: "Workshop on Emerging Technologies on May 15",
      date: "May 03, 2025",
      category: "Workshop & Placement",
    },
    {
      id: 3,
      title: "Mid-Term Examination Schedule Announced",
      date: "December, 2025",
      category: "Exam",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest Notices</h2>
        <Link to="/notices" className="text-primary hover:underline text-sm font-medium">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{notice.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Posted on: {notice.date}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-primary text-xs rounded">
                  {notice.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NoticesSection;

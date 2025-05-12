
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { Home, Users, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { user, profile } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {profile?.full_name || "Admin"}. Here's an overview of your institution.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="1,200"
          description="Across all branches"
          icon={<Users className="h-8 w-8" />}
          color="bg-blue-600"
        />
        <StatCard
          title="Active Notices"
          value="15"
          description="Currently published"
          icon={<FileText className="h-8 w-8" />}
          color="bg-purple-600"
        />
        <StatCard
          title="Recent Activities"
          value="38"
          description="In the last 7 days"
          icon={<Clock className="h-8 w-8" />}
          color="bg-amber-600"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Notices</CardTitle>
            <Link to="/admin/notices/create">
              <Button size="sm" variant="outline" className="text-primary hover:bg-primary hover:text-white">
                Add Notice
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Admission Open for 2025-26</p>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Posted by: Admin</p>
              </li>
              <li className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Workshop on Emerging Technologies</p>
                  <span className="text-sm text-gray-500">4 days ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Posted by: Head of Department (CSE)</p>
              </li>
              <li>
                <div className="flex justify-between">
                  <p className="font-medium">Mid-Term Examination Schedule</p>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Posted by: Examination Committee</p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Gallery Management</CardTitle>
            <Link to="/admin/gallery-management">
              <Button size="sm" variant="outline" className="text-primary hover:bg-primary hover:text-white">
                Add Gallery
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Campus Tour Photos</p>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">15 photos added to gallery</p>
              </li>
              <li className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-medium">Independence Day Celebration</p>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">8 photos added to gallery</p>
              </li>
              <li>
                <div className="flex justify-between">
                  <p className="font-medium">Technical Fest 2024</p>
                  <span className="text-sm text-gray-500">1 year ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">22 photos added to gallery</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-500">{title}</h3>
        <div className={`${color} p-2 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;

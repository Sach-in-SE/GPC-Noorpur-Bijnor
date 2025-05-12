
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Menu, Bell } from "lucide-react";

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/ef735c1d-74fa-4bab-a0c6-622edcec62ac.png" 
              alt="GP Changipur Logo" 
              className="h-8 w-8 mr-2"
            />
            <h1 className="font-semibold text-lg text-primary hidden md:block">Admin Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{profile?.full_name || "Administrator"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-gray-700 hover:text-primary"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;


import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Bell, 
  Image, 
  Settings 
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
}

const AdminSidebar = ({ isOpen = true }: AdminSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="bg-white h-full border-r flex flex-col">
      <div className="p-4">
        <Link
          to="/admin"
          className="flex items-center space-x-2 text-primary hover:text-primary/90"
        >
          <div className="font-semibold text-xl">Admin</div>
        </Link>
      </div>

      <div className="flex-1 py-2 overflow-auto">
        <nav className="px-2 space-y-1">
          <NavItem href="/admin" icon={<BarChart3 size={20} />} active={isActive("/admin")}>
            Dashboard
          </NavItem>
          
          <NavItem href="/admin/notices" icon={<Bell size={20} />} active={currentPath.includes("/admin/notices")}>
            Notices
          </NavItem>
          
          <NavItem href="/admin/gallery-management" icon={<Image size={20} />} active={currentPath.includes("/admin/gallery-management")}>
            Gallery
          </NavItem>
          
          <NavItem href="/admin/settings" icon={<Settings size={20} />} active={currentPath.includes("/admin/settings")}>
            Settings
          </NavItem>
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="text-xs text-gray-500">
          Admin Portal v1.0
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
  nested?: boolean;
}

const NavItem = ({ href, icon, active, children, nested = false }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium group transition-colors
        ${active 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-primary/5 text-gray-700 hover:text-primary"}
        ${nested ? "text-sm" : ""}
      `}
    >
      <span className="flex-shrink-0 mr-2">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default AdminSidebar;

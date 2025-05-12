
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Navigation links to be rendered
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/academics', label: 'Academics' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/hostel', label: 'Hostel' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/notices', label: 'Notices' },
    { to: '/results', label: 'Results' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Main navigation */}
        <nav className="flex items-center justify-between flex-wrap py-4">
          {/* Logo and college name */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ef735c1d-74fa-4bab-a0c6-622edcec62ac.png" 
              alt="GP Changipur Logo" 
              className="h-14 w-14"
            />
            <div>
              <h1 className="text-xl font-bold text-primary lg:text-2xl">GP Changipur</h1>
              <p className="text-x text-gray-600">Noorpur, Bijnor</p>
            </div>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Login/Admin button */}
            <Link to="/login">
              <Button size="sm" variant="outline" className="ml-4 text-primary hover:bg-primary hover:text-white">
                Login
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile navigation dropdown */}
        {isOpen && (
          <div className="lg:hidden border-t py-2">
            <div className="flex flex-col space-y-1 pb-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button size="sm" variant="outline" className="mt-2 w-full text-primary hover:bg-primary hover:text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

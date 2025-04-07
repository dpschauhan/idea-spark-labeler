
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, HelpCircle, Lightbulb } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">IdeaSpark</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant={location.pathname === '/' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button 
            variant={location.pathname === '/ideas' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/ideas" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Ideas</span>
            </Link>
          </Button>
          <Button 
            variant={location.pathname === '/faq' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/faq" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

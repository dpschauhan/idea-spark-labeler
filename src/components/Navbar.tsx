
import React from "react";
import {
  Lightbulb,
  BarChart3,
  Menu,
  X,
  LayoutGrid,
  Layout,
  Bell,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationsPopover from "@/components/NotificationsPopover";

const Navbar = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/ideas", label: "Ideas", icon: <Lightbulb className="h-4 w-4" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { path: "/categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" /> },
    { path: "/templates", label: "Templates", icon: <Layout className="h-4 w-4" /> },
    { path: "/faq", label: "FAQ", icon: null },
  ];

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">IdeaSpark</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <ul className="flex">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <NotificationsPopover />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-4">
                <SheetTitle>IdeaSpark</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-1">
            <NotificationsPopover />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

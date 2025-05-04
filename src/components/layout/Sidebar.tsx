
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  BookText, 
  PlaySquare, 
  BarChart3, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
    },
    {
      name: "Tópicos",
      href: "/topics",
      icon: BookText,
    },
    {
      name: "Pipeline",
      href: "/pipeline",
      icon: PlaySquare,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <div
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 h-16 border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">Reel Hub</h1>
        )}
        {collapsed && <div className="w-8 h-8 rounded-full bg-primary mx-auto" />}
      </div>

      <div className="flex-1 py-6 flex flex-col justify-between">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "sidebar-link",
                location.pathname === item.href && "active",
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-2 space-y-2">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-white"
          >
            <LogOut size={20} className="mr-2" />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

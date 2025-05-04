
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // Check if user is logged in - This will be connected to Supabase later
  // For now it's a placeholder that always returns true after login is implemented
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const isMobile = useIsMobile();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {isMobile && (
            <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-md text-yellow-400 text-sm">
              Esta aplicação é otimizada para desktop. A experiência em dispositivos móveis pode ser limitada.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

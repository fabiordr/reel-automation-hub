
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isLoggedIn, loading } = useAuth();
  const isMobile = useIsMobile();

  // Mostrar carregamento ou redirecionar se não estiver logado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

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

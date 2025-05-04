
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Este componente apenas redireciona para o Dashboard principal
const Index = () => {
  // Verifique se o usuário está autenticado
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  useEffect(() => {
    document.title = "Reel Automation Hub";
  }, []);

  // Se não estiver logado, redireciona para a página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver logado, redireciona para o Dashboard
  return <Navigate to="/" replace />;
};

export default Index;

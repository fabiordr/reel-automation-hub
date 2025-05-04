
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulating Supabase authentication
      // This will be replaced with actual Supabase auth
      // when the Supabase integration is activated
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/");
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo à plataforma Reel Hub.",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao realizar login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Reel Automation Hub</h1>
          <p className="text-muted-foreground">
            Faça login para acessar sua plataforma de automação de vídeos
          </p>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Não tem uma conta?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => {
                  toast({
                    title: "Recurso em desenvolvimento",
                    description: "O cadastro será implementado em breve.",
                  });
                }}
              >
                Cadastre-se
              </Button>
            </p>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            Ao fazer login, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:underline">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

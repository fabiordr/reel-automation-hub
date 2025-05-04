
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  // Dados simulados - seriam obtidos da API do Supabase
  const networkData = [
    { name: "Instagram", views: 120500, growth: "+25%" },
    { name: "YouTube", views: 85000, growth: "+12%" },
    { name: "TikTok", views: 250000, growth: "+45%" },
    { name: "Facebook", views: 63000, growth: "+8%" },
  ];

  const alerts = [
    {
      id: 1,
      title: "Vídeo com baixo desempenho",
      description: "Seu vídeo 'Dicas de Fotografia' está com 70% menos visualizações que o esperado.",
      type: "warning" as const,
    },
    {
      id: 2,
      title: "Falha na publicação",
      description: "O vídeo 'Tendências 2025' não foi publicado devido a problemas na API do TikTok.",
      type: "error" as const,
    },
  ];

  const revenueMetrics = {
    totalRevenue: 5830,
    totalCost: 2150,
    roi: 171,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {networkData.map((network) => (
          <Card key={network.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {network.name}
                <span className="ml-auto text-green-400 text-sm font-normal flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {network.growth}
                </span>
              </CardTitle>
              <CardDescription>Total de visualizações</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {network.views.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Lucro e Gastos</CardTitle>
            <CardDescription>
              Análise de ROI dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Receita Total</span>
                <span className="text-green-400 font-medium">
                  R$ {revenueMetrics.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Custos Totais</span>
                <span className="text-red-400 font-medium">
                  R$ {revenueMetrics.totalCost.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">ROI</span>
                  <span className="text-xl font-bold text-primary">
                    {revenueMetrics.roi}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Alertas Recentes
            </CardTitle>
            <CardDescription>
              Notificações importantes sobre seus vídeos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.type === "error" ? "destructive" : "default"}
              >
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Desempenho por Rede
            </CardTitle>
            <CardDescription>
              Visualizações dos últimos 7 dias por plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Gráfico de desempenho será exibido aqui.
              <br />
              (Implementar com Recharts após integração com API)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

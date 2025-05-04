
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVideos } from "@/hooks/use-videos";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Analytics = () => {
  const { videos, loading } = useVideos();
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalRevenue: 0,
    totalCost: 0,
    roi: 0
  });

  // Simula detecção de alertas
  const [alerts, setAlerts] = useState<{id: number; title: string; description: string; type: "warning" | "error"}[]>([]);

  // Calcular dados consolidados quando os vídeos forem carregados
  useEffect(() => {
    if (videos && videos.length > 0) {
      // Calcular métricas por plataforma
      const platforms: Record<string, { views: number, growth: string }> = {
        instagram: { views: 0, growth: "+0%" },
        youtube: { views: 0, growth: "+0%" },
        tiktok: { views: 0, growth: "+0%" },
        facebook: { views: 0, growth: "+0%" },
      };

      // Somar visualizações por plataforma
      videos.forEach(video => {
        if (video.views) {
          Object.entries(video.views).forEach(([platform, views]) => {
            if (platforms[platform]) {
              platforms[platform].views += views;
            }
          });
        }
      });

      // Simulação de crescimento (em uma app real, isso viria de dados históricos)
      platforms.instagram.growth = "+25%";
      platforms.youtube.growth = "+12%";
      platforms.tiktok.growth = "+45%";
      platforms.facebook.growth = "+8%";

      // Transformar em um array para exibição
      const platformArray = Object.entries(platforms).map(([name, data]) => ({
        name,
        views: data.views,
        growth: data.growth
      }));
      
      setPlatformData(platformArray);

      // Calcular métricas financeiras
      const totalCost = videos.reduce((sum, video) => sum + (video.cost || 0), 0);
      const totalRevenue = videos.reduce((sum, video) => sum + (video.revenue || 0), 0);
      const roi = totalCost > 0 ? Math.round((totalRevenue - totalCost) / totalCost * 100) : 0;
      
      setRevenueMetrics({
        totalRevenue,
        totalCost,
        roi
      });

      // Gerar alertas
      const videoAlerts = [];
      
      // Encontrar vídeos com desempenho baixo
      const lowPerformanceVideo = videos.find(v => {
        const totalViews = Object.values(v.views || {}).reduce((sum, views) => sum + views, 0);
        return totalViews < 100 && v.status === 'published';
      });
      
      if (lowPerformanceVideo) {
        videoAlerts.push({
          id: 1,
          title: "Vídeo com baixo desempenho",
          description: `Seu vídeo "${lowPerformanceVideo.title}" está com poucas visualizações.`,
          type: "warning" as const
        });
      }

      // Encontrar vídeos com falha
      const failedVideo = videos.find(v => v.status === 'failed');
      if (failedVideo) {
        videoAlerts.push({
          id: 2,
          title: "Falha na publicação",
          description: `O vídeo "${failedVideo.title}" falhou durante o processamento.`,
          type: "error" as const
        });
      }

      setAlerts(videoAlerts);
    }
  }, [videos]);

  // Gerar dados para o gráfico
  const getChartData = () => {
    // Dados dos últimos 7 dias (simulados)
    const networkNames = ['instagram', 'youtube', 'tiktok', 'facebook'];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return days.map(day => {
      const data: any = { day };
      
      networkNames.forEach(network => {
        // Valores aleatórios para simulação
        data[network] = Math.floor(Math.random() * 10000);
      });
      
      return data;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando dados de analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho dos seus vídeos nas redes sociais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformData.map((network) => (
          <Card key={network.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {network.name.charAt(0).toUpperCase() + network.name.slice(1)}
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
                  <span className={`text-xl font-bold ${revenueMetrics.roi > 100 ? 'text-green-500' : 'text-red-500'}`}>
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
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={alert.type === "error" ? "destructive" : "default"}
                >
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="flex justify-center items-center p-4">
                <p className="text-muted-foreground">Nenhum alerta no momento.</p>
              </div>
            )}
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
          <CardContent className="h-80">
            {videos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="instagram" fill="#E1306C" />
                  <Bar dataKey="youtube" fill="#FF0000" />
                  <Bar dataKey="tiktok" fill="#69C9D0" />
                  <Bar dataKey="facebook" fill="#3b5998" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">
                  Crie alguns vídeos para visualizar dados de desempenho.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30");
  const [platform, setPlatform] = useState("all");
  const [topic, setTopic] = useState("all");

  // Dados simulados para os gráficos
  const videoPerformanceData = [
    { name: "Como fazer café ideal", views: 45500, revenue: 185, cost: 45, platform: "tiktok" },
    { name: "10 hábitos matinais", views: 72300, revenue: 290, cost: 50, platform: "instagram" },
    { name: "Melhores livros 2025", views: 31000, revenue: 125, cost: 48, platform: "youtube" },
    { name: "Viagem em promoção", views: 64200, revenue: 260, cost: 55, platform: "youtube" },
    { name: "Organização de casa", views: 53000, revenue: 215, cost: 42, platform: "instagram" },
    { name: "Dicas para dormir", views: 81500, revenue: 325, cost: 52, platform: "tiktok" },
  ];

  // Dados para gráfico de crescimento
  const growthData = [
    { date: "01/04", views: 12300, revenue: 49 },
    { date: "08/04", views: 18500, revenue: 75 },
    { date: "15/04", views: 25600, revenue: 105 },
    { date: "22/04", views: 35800, revenue: 145 },
    { date: "29/04", views: 42500, revenue: 170 },
    { date: "06/05", views: 54800, revenue: 220 },
  ];

  // Calcular estatísticas gerais
  const totalViews = videoPerformanceData.reduce((sum, item) => sum + item.views, 0);
  const totalRevenue = videoPerformanceData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = videoPerformanceData.reduce((sum, item) => sum + item.cost, 0);
  const averageCost = totalCost / videoPerformanceData.length;
  const averageRevenue = totalRevenue / videoPerformanceData.length;
  const roi = ((totalRevenue - totalCost) / totalCost * 100).toFixed(1);
  
  // Encontrar o vídeo mais lucrativo
  const mostProfitableVideo = videoPerformanceData.reduce((prev, current) => 
    (current.revenue - current.cost) > (prev.revenue - prev.cost) ? current : prev
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">Views: {payload[0].value.toLocaleString()}</p>
          {payload[1] && <p className="text-sm text-primary">R$ {payload[1].value}</p>}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics & ROI</h1>
        <p className="text-muted-foreground">
          Análise de desempenho e retorno sobre investimento dos seus vídeos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Views</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Receita Estimada</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">R$ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">ROI Geral</CardTitle>
            <CardDescription>Retorno sobre investimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{roi}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Estatísticas de Desempenho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vídeos publicados</span>
                <span>{videoPerformanceData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo médio por vídeo</span>
                <span>R$ {averageCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receita média por vídeo</span>
                <span>R$ {averageRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vídeo mais lucrativo</span>
                <span>{mostProfitableVideo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Break-even point</span>
                <span>{Math.ceil(averageCost / (averageRevenue / videoPerformanceData[0].views))} views</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Melhor plataforma</span>
                <span>TikTok</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="font-medium mb-3">Filtros</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Período</Label>
                    <Select defaultValue={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="date-range">
                        <SelectValue placeholder="Selecione um período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="90">90 dias</SelectItem>
                        <SelectItem value="365">1 ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform-filter">Plataforma</Label>
                    <Select defaultValue={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="platform-filter">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic-filter">Tópico</Label>
                  <Select defaultValue={topic} onValueChange={setTopic}>
                    <SelectTrigger id="topic-filter">
                      <SelectValue placeholder="Tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="productivity">Produtividade</SelectItem>
                      <SelectItem value="recipes">Receitas</SelectItem>
                      <SelectItem value="science">Ciência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho por Rede Social</CardTitle>
            <CardDescription>
              Visualizações e receita por vídeo
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Tabs defaultValue="views">
              <TabsList className="mb-4">
                <TabsTrigger value="views">Visualizações</TabsTrigger>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
                <TabsTrigger value="roi">ROI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="views" className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={videoPerformanceData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#aaa' }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                    />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="views" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="revenue" className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={videoPerformanceData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#aaa' }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                    />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="roi" className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={videoPerformanceData.map(item => ({
                      ...item,
                      roi: ((item.revenue - item.cost) / item.cost * 100).toFixed(0)
                    }))}
                    margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#aaa' }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                    />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="roi" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crescimento ao Longo do Tempo</CardTitle>
          <CardDescription>
            Evolução das visualizações e receita nas últimas semanas
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fill: '#aaa' }} />
              <YAxis yAxisId="left" tick={{ fill: '#aaa' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#aaa' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="views" 
                stroke="#9b87f5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4ade80" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

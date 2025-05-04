
import { Play, CheckCircle2, AlertCircle, Loader2, RefreshCw, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Pipeline = () => {
  // Dados simulados
  const videos = [
    {
      id: 1,
      title: "10 Hábitos de Produtividade",
      topic: "Dicas de Produtividade",
      createdAt: "2025-05-01T10:30:00Z",
      status: "completed",
      platforms: ["instagram", "tiktok"],
      steps: [
        { name: "Roteiro", status: "completed", updatedAt: "2025-05-01T10:35:00Z" },
        { name: "Voz", status: "completed", updatedAt: "2025-05-01T10:40:00Z" },
        { name: "Imagens", status: "completed", updatedAt: "2025-05-01T10:55:00Z" },
        { name: "Montagem", status: "completed", updatedAt: "2025-05-01T11:15:00Z" },
        { name: "Publicação", status: "completed", updatedAt: "2025-05-01T11:20:00Z" },
      ],
      preview: {
        script: "Hoje vamos falar sobre 10 hábitos que podem transformar sua produtividade...",
        imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500",
        audioUrl: "#",
        videoUrl: "#"
      }
    },
    {
      id: 2,
      title: "Como Fazer Smoothie Verde",
      topic: "Receitas Simples",
      createdAt: "2025-05-03T09:15:00Z",
      status: "in_progress",
      platforms: ["youtube", "instagram"],
      steps: [
        { name: "Roteiro", status: "completed", updatedAt: "2025-05-03T09:20:00Z" },
        { name: "Voz", status: "completed", updatedAt: "2025-05-03T09:30:00Z" },
        { name: "Imagens", status: "completed", updatedAt: "2025-05-03T09:45:00Z" },
        { name: "Montagem", status: "in_progress", updatedAt: "2025-05-03T10:00:00Z" },
        { name: "Publicação", status: "pending", updatedAt: null },
      ],
      preview: {
        script: "Neste vídeo vou mostrar como fazer um smoothie verde nutritivo em apenas 3 minutos...",
        imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500",
        audioUrl: "#",
        videoUrl: null
      }
    },
    {
      id: 3,
      title: "Fascinantes Fatos sobre Buracos Negros",
      topic: "Curiosidades Científicas",
      createdAt: "2025-05-04T14:00:00Z",
      status: "failed",
      platforms: ["tiktok"],
      steps: [
        { name: "Roteiro", status: "completed", updatedAt: "2025-05-04T14:05:00Z" },
        { name: "Voz", status: "completed", updatedAt: "2025-05-04T14:15:00Z" },
        { name: "Imagens", status: "failed", updatedAt: "2025-05-04T14:30:00Z" },
        { name: "Montagem", status: "pending", updatedAt: null },
        { name: "Publicação", status: "pending", updatedAt: null },
      ],
      preview: {
        script: "Os buracos negros são alguns dos objetos mais fascinantes e misteriosos do universo...",
        imageUrl: null,
        audioUrl: "#",
        videoUrl: null,
        error: "Falha ao gerar imagem: prompt contém termo com restrição de conteúdo"
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Play className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepProgress = (steps: any[]) => {
    const completed = steps.filter(step => step.status === "completed").length;
    return (completed / steps.length) * 100;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pipeline de Vídeos</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso de seus vídeos em produção automatizada.
        </p>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="failed">Falhas</TabsTrigger>
          </TabsList>

          <Button>
            <Play className="w-4 h-4 mr-2" />
            Novo Vídeo
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6">
          {videos.map(video => (
            <Card key={video.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>
                      Tópico: {video.topic} • Criado em: {new Date(video.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {video.platforms.map(platform => (
                      <Badge key={platform} variant="outline">{platform}</Badge>
                    ))}
                    <Badge 
                      variant={
                        video.status === "completed" ? "default" : 
                        video.status === "in_progress" ? "secondary" : 
                        "destructive"
                      }
                    >
                      {video.status === "completed" ? "Concluído" : 
                       video.status === "in_progress" ? "Em Progresso" : 
                       "Falha"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso:</span>
                    <span className="text-sm">{Math.round(getStepProgress(video.steps))}%</span>
                  </div>
                  <Progress value={getStepProgress(video.steps)} />
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {video.steps.map(step => (
                    <div key={step.name} className="flex flex-col items-center p-2 border border-border rounded-md">
                      <div className="flex items-center justify-center mb-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <span className="text-xs">{step.name}</span>
                      {step.status === "failed" && (
                        <Button size="sm" variant="ghost" className="mt-1 h-6 text-xs">
                          <RefreshCw className="w-3 h-3 mr-1" /> Retry
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {video.preview.error && (
                  <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
                    <AlertCircle className="w-4 h-4 inline-block mr-2" />
                    {video.preview.error}
                  </div>
                )}

                <div className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Visualizar Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{video.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Roteiro</h3>
                            <div className="p-3 bg-secondary/50 rounded-md text-sm h-40 overflow-y-auto">
                              {video.preview.script}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Áudio</h3>
                            <div className="p-3 bg-secondary/50 rounded-md h-12 flex items-center justify-center">
                              {video.preview.audioUrl ? (
                                <Button size="sm" disabled={video.preview.audioUrl === "#"}>
                                  <Play className="w-4 h-4 mr-2" /> Ouvir Narração
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">Áudio não disponível</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Preview</h3>
                          {video.preview.imageUrl ? (
                            <img 
                              src={video.preview.imageUrl} 
                              alt="Preview" 
                              className="w-full h-64 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-64 bg-secondary/50 flex items-center justify-center rounded-md">
                              <span className="text-sm text-muted-foreground">Preview não disponível</span>
                            </div>
                          )}
                          <div className="mt-4">
                            <Button className="w-full" disabled={!video.preview.videoUrl}>
                              <Play className="w-4 h-4 mr-2" /> Assistir Vídeo Final
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="in_progress">
          {videos.filter(video => video.status === "in_progress").length > 0 ? (
            videos
              .filter(video => video.status === "in_progress")
              .map(video => (
                // Conteúdo similar à aba "all", mas somente para vídeos em progresso
                <Card key={video.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{video.title}</CardTitle>
                        <CardDescription>
                          Tópico: {video.topic} • Criado em: {new Date(video.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.platforms.map(platform => (
                          <Badge key={platform} variant="outline">{platform}</Badge>
                        ))}
                        <Badge variant="secondary">Em Progresso</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progresso:</span>
                        <span className="text-sm">{Math.round(getStepProgress(video.steps))}%</span>
                      </div>
                      <Progress value={getStepProgress(video.steps)} />
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {video.steps.map(step => (
                        <div key={step.name} className="flex flex-col items-center p-2 border border-border rounded-md">
                          <div className="flex items-center justify-center mb-1">
                            {getStatusIcon(step.status)}
                          </div>
                          <span className="text-xs">{step.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Visualizar Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum vídeo em progresso no momento.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {videos.filter(video => video.status === "completed").length > 0 ? (
            videos
              .filter(video => video.status === "completed")
              .map(video => (
                // Exibição similar à aba "all", mas somente para vídeos concluídos
                <Card key={video.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{video.title}</CardTitle>
                        <CardDescription>
                          Tópico: {video.topic} • Criado em: {new Date(video.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.platforms.map(platform => (
                          <Badge key={platform} variant="outline">{platform}</Badge>
                        ))}
                        <Badge>Concluído</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progresso:</span>
                        <span className="text-sm">100%</span>
                      </div>
                      <Progress value={100} />
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {video.steps.map(step => (
                        <div key={step.name} className="flex flex-col items-center p-2 border border-border rounded-md">
                          <div className="flex items-center justify-center mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="text-xs">{step.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Visualizar Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum vídeo concluído encontrado.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="failed">
          {videos.filter(video => video.status === "failed").length > 0 ? (
            videos
              .filter(video => video.status === "failed")
              .map(video => (
                // Exibição similar à aba "all", mas somente para vídeos com falha
                <Card key={video.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{video.title}</CardTitle>
                        <CardDescription>
                          Tópico: {video.topic} • Criado em: {new Date(video.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {video.platforms.map(platform => (
                          <Badge key={platform} variant="outline">{platform}</Badge>
                        ))}
                        <Badge variant="destructive">Falha</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progresso:</span>
                        <span className="text-sm">{Math.round(getStepProgress(video.steps))}%</span>
                      </div>
                      <Progress value={getStepProgress(video.steps)} />
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {video.steps.map(step => (
                        <div key={step.name} className="flex flex-col items-center p-2 border border-border rounded-md">
                          <div className="flex items-center justify-center mb-1">
                            {getStatusIcon(step.status)}
                          </div>
                          <span className="text-xs">{step.name}</span>
                          {step.status === "failed" && (
                            <Button size="sm" variant="ghost" className="mt-1 h-6 text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" /> Retry
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {video.preview.error && (
                      <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
                        <AlertCircle className="w-4 h-4 inline-block mr-2" />
                        {video.preview.error}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" /> Visualizar Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Nenhum vídeo com falha encontrado.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pipeline;

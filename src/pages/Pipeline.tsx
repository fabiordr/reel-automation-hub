
import { useState, useEffect } from "react";
import { Play, CheckCircle2, AlertCircle, Loader2, RefreshCw, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVideos } from "@/hooks/use-videos";
import { useTopics } from "@/hooks/use-topics";
import { Video, VideoStep } from "@/types/supabase";

const PipelineVideoCard = ({ video, onRetry }: { 
  video: Video;
  onRetry: (videoId: string, stepName: string) => void;
}) => {
  const [steps, setSteps] = useState<VideoStep[]>([]);
  const { fetchVideoSteps } = useVideos();
  const { topics } = useTopics();
  const [videoDetails, setVideoDetails] = useState<boolean>(false);

  // Busca as etapas do vídeo
  useEffect(() => {
    const getSteps = async () => {
      const videoSteps = await fetchVideoSteps(video.id);
      setSteps(videoSteps);
    };
    getSteps();
  }, [video.id]);

  const topic = topics.find(t => t.id === video.topic_id);

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

  const getStepProgress = () => {
    if (!steps || steps.length === 0) return 0;
    const completed = steps.filter(step => step.status === "completed").length;
    return (completed / steps.length) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{video.title}</CardTitle>
            <CardDescription>
              Tópico: {topic?.name || 'Desconhecido'} • Criado em: {new Date(video.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {video.published_platforms && video.published_platforms.length > 0 && 
              video.published_platforms.map((platform: string) => (
                <Badge key={platform} variant="outline">{platform}</Badge>
              ))
            }
            <Badge 
              variant={
                video.status === "published" ? "default" : 
                video.status === "failed" ? "destructive" : 
                "secondary"
              }
            >
              {video.status === "published" ? "Concluído" : 
               video.status === "failed" ? "Falha" : 
               "Em Progresso"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso:</span>
            <span className="text-sm">{Math.round(getStepProgress())}%</span>
          </div>
          <Progress value={getStepProgress()} />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center p-2 border border-border rounded-md">
              <div className="flex items-center justify-center mb-1">
                {getStatusIcon(step.status)}
              </div>
              <span className="text-xs">{step.step_name}</span>
              {step.status === "failed" && (
                <Button size="sm" variant="ghost" className="mt-1 h-6 text-xs" onClick={() => onRetry(video.id, step.step_name)}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Retry
                </Button>
              )}
            </div>
          ))}
        </div>

        {video.error_message && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
            <AlertCircle className="w-4 h-4 inline-block mr-2" />
            {video.error_message}
          </div>
        )}

        <div className="flex justify-end">
          <Dialog open={videoDetails} onOpenChange={setVideoDetails}>
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
                      {video.script || "Roteiro não disponível"}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Áudio</h3>
                    <div className="p-3 bg-secondary/50 rounded-md h-12 flex items-center justify-center">
                      {video.audio_url ? (
                        <Button size="sm" disabled={!video.audio_url}>
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
                  {video.image_url ? (
                    <img 
                      src={video.image_url} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-secondary/50 flex items-center justify-center rounded-md">
                      <span className="text-sm text-muted-foreground">Preview não disponível</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <Button className="w-full" disabled={!video.video_url}>
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
  );
};

const NewVideoDialog = ({ open, onOpenChange, topics }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: Topic[];
}) => {
  const [title, setTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const { createVideo } = useVideos();

  const handleCreateVideo = async () => {
    if (!title || !selectedTopic) return;
    
    await createVideo(title, selectedTopic);
    setTitle("");
    setSelectedTopic("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Vídeo</DialogTitle>
          <DialogDescription>
            Adicione um novo vídeo para produção automatizada.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Título do Vídeo</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 10 Dicas para Aumentar sua Produtividade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-topic">Tópico</Label>
            <Select
              value={selectedTopic}
              onValueChange={setSelectedTopic}
            >
              <SelectTrigger id="video-topic">
                <SelectValue placeholder="Selecione um tópico" />
              </SelectTrigger>
              <SelectContent>
                {topics.filter(t => t.status === 'active').map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateVideo} 
            disabled={!title || !selectedTopic}
          >
            Criar Vídeo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Pipeline = () => {
  const { videos, loading, updateVideoStep } = useVideos();
  const { topics, loading: loadingTopics } = useTopics();
  const [newVideoDialogOpen, setNewVideoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredVideos = videos.filter(video => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') return ['script', 'voice', 'image', 'editing'].includes(video.status);
    if (activeTab === 'completed') return video.status === 'published';
    if (activeTab === 'failed') return video.status === 'failed';
    return true;
  });

  const handleRetryStep = async (videoId: string, stepName: string) => {
    await updateVideoStep(videoId, stepName, 'pending');
  };

  if (loading || loadingTopics) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando vídeos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pipeline de Vídeos</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso de seus vídeos em produção automatizada.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="failed">Falhas</TabsTrigger>
          </TabsList>

          <Button onClick={() => setNewVideoDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Vídeo
          </Button>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <PipelineVideoCard 
                key={video.id}
                video={video}
                onRetry={handleRetryStep}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                {activeTab === 'all' && 'Nenhum vídeo encontrado.'}
                {activeTab === 'in_progress' && 'Nenhum vídeo em progresso no momento.'}
                {activeTab === 'completed' && 'Nenhum vídeo concluído encontrado.'}
                {activeTab === 'failed' && 'Nenhum vídeo com falha encontrado.'}
              </p>
              {activeTab === 'all' && topics.length > 0 && (
                <Button 
                  className="mt-4"
                  onClick={() => setNewVideoDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Seu Primeiro Vídeo
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NewVideoDialog
        open={newVideoDialogOpen}
        onOpenChange={setNewVideoDialogOpen}
        topics={topics}
      />
    </div>
  );
};

export default Pipeline;


import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTopics } from "@/hooks/use-topics";
import { useVideos } from "@/hooks/use-videos";
import { Topic } from "@/types/supabase";

const TopicCard = ({ topic, onToggleStatus, onEdit, onDelete }: {
  topic: Topic;
  onToggleStatus: (id: string, status: string) => void;
  onEdit: (topic: Topic) => void;
  onDelete: (id: string) => void;
}) => {
  const { videos, loading } = useVideos(topic.id);
  
  // Calcular métricas
  const videoCount = videos.length;
  const totalCost = videos.reduce((sum, video) => sum + (video.cost || 0), 0);
  const totalRevenue = videos.reduce((sum, video) => sum + (video.revenue || 0), 0);
  
  const getROI = () => {
    if (totalCost === 0) return "0";
    return ((totalRevenue - totalCost) / totalCost * 100).toFixed(0);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{topic.name}</CardTitle>
            <CardDescription className="mt-1">
              {topic.description}
            </CardDescription>
          </div>
          <Badge variant={topic.status === "active" ? "default" : "secondary"}>
            {topic.status === "active" ? "Ativo" : "Pausado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vídeos:</span>
            <span>{videoCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Custo Total:</span>
            <span>R$ {totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Receita:</span>
            <span>R$ {totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium">ROI:</span>
            <span className="font-bold text-primary">
              {getROI()}%
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(topic)}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(topic.id)}>
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={() => onToggleStatus(topic.id, topic.status)}>
          {topic.status === "active" ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Ativar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Topics = () => {
  const { topics, loading, createTopic, updateTopic, deleteTopic, toggleTopicStatus } = useTopics();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");

  // Reset do formulário quando abrir ou fechar o diálogo
  useEffect(() => {
    if (!dialogOpen) {
      setEditingTopic(null);
      setTopicName("");
      setTopicDescription("");
    }
  }, [dialogOpen]);

  // Preencher o formulário se estiver editando
  useEffect(() => {
    if (editingTopic) {
      setTopicName(editingTopic.name);
      setTopicDescription(editingTopic.description || "");
      setDialogOpen(true);
    }
  }, [editingTopic]);

  const handleCreateOrUpdateTopic = async () => {
    if (editingTopic) {
      await updateTopic(editingTopic.id, {
        name: topicName,
        description: topicDescription
      });
    } else {
      await createTopic(topicName, topicDescription);
    }
    setDialogOpen(false);
  };

  const handleDeleteTopic = async (id: string) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este tópico? Todos os vídeos associados também serão excluídos.");
    if (confirmed) {
      await deleteTopic(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando tópicos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciador de Tópicos</h1>
          <p className="text-muted-foreground">
            Crie e gerencie tópicos para seus vídeos automatizados.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Tópico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTopic ? "Editar Tópico" : "Criar Novo Tópico"}</DialogTitle>
              <DialogDescription>
                {editingTopic 
                  ? "Atualize as informações do tópico selecionado."
                  : "Defina um nome e descrição para seu novo tópico de conteúdo."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="topic-name">Nome do Tópico</Label>
                <Input
                  id="topic-name"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Ex: Dicas de Marketing Digital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic-description">Descrição</Label>
                <Textarea
                  id="topic-description"
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="Descreva o propósito deste tópico e o tipo de conteúdo a ser gerado..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateOrUpdateTopic}>
                {editingTopic ? "Salvar Alterações" : "Criar Tópico"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">Você ainda não criou nenhum tópico.</p>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Seu Primeiro Tópico
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onToggleStatus={toggleTopicStatus}
              onEdit={setEditingTopic}
              onDelete={handleDeleteTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Topics;

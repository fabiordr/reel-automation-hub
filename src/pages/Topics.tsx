
import { useState } from "react";
import { PlusCircle, Edit, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const Topics = () => {
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");

  // Simular dados de tópicos
  const topics = [
    {
      id: 1,
      name: "Dicas de Produtividade",
      description: "Vídeos curtos com dicas rápidas para melhorar a produtividade.",
      status: "active",
      videoCount: 8,
      cost: 175,
      revenue: 530,
    },
    {
      id: 2,
      name: "Receitas Simples",
      description: "Receitas rápidas com menos de 5 ingredientes.",
      status: "paused",
      videoCount: 12,
      cost: 240,
      revenue: 890,
    },
    {
      id: 3,
      name: "Curiosidades Científicas",
      description: "Fatos interessantes sobre ciência explicados de forma simples.",
      status: "active",
      videoCount: 5,
      cost: 120,
      revenue: 310,
    },
  ];

  const handleCreateTopic = () => {
    // Simulando criação de tópico no Supabase
    toast({
      title: "Tópico criado com sucesso",
      description: `O tópico "${topicName}" foi criado.`,
    });
    setNewTopicOpen(false);
    setTopicName("");
    setTopicDescription("");
  };

  const getROI = (revenue: number, cost: number) => {
    return ((revenue - cost) / cost * 100).toFixed(0);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciador de Tópicos</h1>
          <p className="text-muted-foreground">
            Crie e gerencie tópicos para seus vídeos automatizados.
          </p>
        </div>
        <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Tópico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Tópico</DialogTitle>
              <DialogDescription>
                Defina um nome e descrição para seu novo tópico de conteúdo.
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
              <Button variant="outline" onClick={() => setNewTopicOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateTopic}>Criar Tópico</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id}>
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
                  <span>{topic.videoCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Custo Total:</span>
                  <span>R$ {topic.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Receita:</span>
                  <span>R$ {topic.revenue}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium">ROI:</span>
                  <span className="font-bold text-primary">
                    {getROI(topic.revenue, topic.cost)}%
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
              <Button size="sm" variant="outline">
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
        ))}
      </div>
    </div>
  );
};

export default Topics;


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Topic } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTopics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar tópicos",
        description: error.message || "Ocorreu um erro ao carregar os tópicos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (name: string, description: string | null = null) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("topics")
        .insert([{ name, description, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Tópico criado",
        description: `O tópico "${name}" foi criado com sucesso.`,
      });
      
      await fetchTopics();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar tópico",
        description: error.message || "Ocorreu um erro ao criar o tópico.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTopic = async (
    id: string, 
    updates: { name?: string; description?: string | null; status?: 'active' | 'paused' | 'canceled' }
  ) => {
    try {
      const { error } = await supabase
        .from("topics")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Tópico atualizado",
        description: "O tópico foi atualizado com sucesso.",
      });
      
      await fetchTopics();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar tópico",
        description: error.message || "Ocorreu um erro ao atualizar o tópico.",
        variant: "destructive",
      });
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Tópico removido",
        description: "O tópico foi removido com sucesso.",
      });
      
      await fetchTopics();
    } catch (error: any) {
      toast({
        title: "Erro ao remover tópico",
        description: error.message || "Ocorreu um erro ao remover o tópico.",
        variant: "destructive",
      });
    }
  };

  const toggleTopicStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from("topics")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: newStatus === 'active' ? "Tópico ativado" : "Tópico pausado",
        description: `O tópico foi ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso.`,
      });
      
      await fetchTopics();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do tópico.",
        variant: "destructive",
      });
    }
  };

  const getTopicById = (id: string) => {
    return topics.find(topic => topic.id === id) || null;
  };

  useEffect(() => {
    if (user) {
      fetchTopics();
    }
  }, [user]);

  return {
    topics,
    loading,
    createTopic,
    updateTopic,
    deleteTopic,
    toggleTopicStatus,
    getTopicById,
    fetchTopics,
  };
};

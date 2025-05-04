
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Video, VideoStep } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useVideos = (topicId?: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchVideos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (topicId) {
        query = query.eq("topic_id", topicId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vídeos",
        description: error.message || "Ocorreu um erro ao carregar os vídeos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (title: string, topicId: string) => {
    if (!user) return null;
    
    try {
      // Primeiro criamos o vídeo
      const { data, error } = await supabase
        .from("videos")
        .insert([{ 
          title, 
          topic_id: topicId, 
          user_id: user.id,
          status: 'script'
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Depois criamos as etapas para o vídeo
      // Corrigindo a tipagem e estrutura dos dados para a inserção
      const stepsData = [
        { video_id: data.id, step_name: 'script', status: 'pending' },
        { video_id: data.id, step_name: 'voice', status: 'pending' },
        { video_id: data.id, step_name: 'image', status: 'pending' },
        { video_id: data.id, step_name: 'editing', status: 'pending' },
        { video_id: data.id, step_name: 'publishing', status: 'pending' }
      ];
      
      const { error: stepsError } = await supabase
        .from("video_steps")
        .insert(stepsData);
        
      if (stepsError) throw stepsError;
      
      toast({
        title: "Vídeo criado",
        description: `O vídeo "${title}" foi criado com sucesso.`,
      });
      
      await fetchVideos();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar vídeo",
        description: error.message || "Ocorreu um erro ao criar o vídeo.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateVideoStatus = async (id: string, status: string, errorMessage?: string) => {
    try {
      const updates: { status: string; error_message?: string | null } = { 
        status 
      };
      
      if (errorMessage) {
        updates.error_message = errorMessage;
      }
      
      const { error } = await supabase
        .from("videos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      if (status === 'failed') {
        toast({
          title: "Falha no processamento",
          description: errorMessage || "Ocorreu um erro no processamento do vídeo.",
          variant: "destructive",
        });
      }
      
      await fetchVideos();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status do vídeo.",
        variant: "destructive",
      });
    }
  };

  const updateVideoStep = async (
    videoId: string, 
    stepName: string, 
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
    metadata?: Record<string, any>
  ) => {
    try {
      // Primeiro encontramos o ID da etapa
      const { data: stepData, error: fetchError } = await supabase
        .from("video_steps")
        .select("id")
        .eq("video_id", videoId)
        .eq("step_name", stepName)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      if (!stepData) throw new Error(`Etapa ${stepName} não encontrada para o vídeo`);
      
      // Atualizar a etapa
      const updates: { status: string; metadata?: Record<string, any> } = { status };
      if (metadata) {
        updates.metadata = metadata;
      }
      
      const { error } = await supabase
        .from("video_steps")
        .update(updates)
        .eq("id", stepData.id);

      if (error) throw error;
      
      // Atualizamos também o status do vídeo se necessário
      if (status === 'failed') {
        await updateVideoStatus(videoId, 'failed', `Falha na etapa: ${stepName}`);
      } else if (stepName === 'publishing' && status === 'completed') {
        await updateVideoStatus(videoId, 'published');
      } else {
        // Para outras etapas, atualizamos o status do vídeo para o nome da próxima etapa
        const stepOrder = ['script', 'voice', 'image', 'editing', 'publishing'];
        const currentIndex = stepOrder.indexOf(stepName);
        if (status === 'completed' && currentIndex < stepOrder.length - 1) {
          await updateVideoStatus(videoId, stepOrder[currentIndex + 1]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar etapa",
        description: error.message || "Ocorreu um erro ao atualizar a etapa do vídeo.",
        variant: "destructive",
      });
    }
  };

  const fetchVideoSteps = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from("video_steps")
        .select("*")
        .eq("video_id", videoId)
        .order("step_name");
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar etapas",
        description: error.message || "Ocorreu um erro ao carregar as etapas do vídeo.",
        variant: "destructive",
      });
      return [];
    }
  };

  const updateVideoContent = async (
    id: string,
    updates: {
      script?: string | null;
      audio_url?: string | null;
      image_url?: string | null;
      video_url?: string | null;
    }
  ) => {
    try {
      const { error } = await supabase
        .from("videos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchVideos();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar conteúdo",
        description: error.message || "Ocorreu um erro ao atualizar o conteúdo do vídeo.",
        variant: "destructive",
      });
    }
  };

  const updateVideoAnalytics = async (
    id: string,
    updates: {
      published_platforms?: string[];
      views?: Record<string, number>;
      cost?: number;
      revenue?: number;
    }
  ) => {
    try {
      const { error } = await supabase
        .from("videos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchVideos();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar métricas",
        description: error.message || "Ocorreu um erro ao atualizar as métricas do vídeo.",
        variant: "destructive",
      });
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Vídeo removido",
        description: "O vídeo foi removido com sucesso.",
      });
      
      await fetchVideos();
    } catch (error: any) {
      toast({
        title: "Erro ao remover vídeo",
        description: error.message || "Ocorreu um erro ao remover o vídeo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user, topicId]);

  return {
    videos,
    loading,
    createVideo,
    updateVideoStatus,
    updateVideoStep,
    fetchVideoSteps,
    updateVideoContent,
    updateVideoAnalytics,
    deleteVideo,
    fetchVideos,
  };
};

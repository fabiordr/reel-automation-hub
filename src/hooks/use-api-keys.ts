
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ApiKey } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchApiKeys = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("service", { ascending: true });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chaves de API",
        description: error.message || "Ocorreu um erro ao carregar as chaves de API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (service: string, apiKey: string) => {
    if (!user) return;
    
    try {
      // Verificar se já existe uma chave para este serviço
      const { data: existingKey } = await supabase
        .from("api_keys")
        .select("*")
        .eq("service", service)
        .maybeSingle();

      let result;
      
      if (existingKey) {
        // Atualizar chave existente
        result = await supabase
          .from("api_keys")
          .update({ api_key: apiKey })
          .eq("id", existingKey.id);
      } else {
        // Inserir nova chave
        result = await supabase
          .from("api_keys")
          .insert([{ service, api_key: apiKey, user_id: user.id }]);
      }

      if (result.error) throw result.error;
      
      toast({
        title: "Chave de API salva",
        description: `A chave para ${service} foi salva com sucesso.`,
      });
      
      await fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar chave de API",
        description: error.message || "Ocorreu um erro ao salvar a chave de API.",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Chave de API removida",
        description: "A chave de API foi removida com sucesso.",
      });
      
      await fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Erro ao remover chave de API",
        description: error.message || "Ocorreu um erro ao remover a chave de API.",
        variant: "destructive",
      });
    }
  };

  const getApiKey = (service: string) => {
    return apiKeys.find(key => key.service === service)?.api_key || null;
  };

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  return {
    apiKeys,
    loading,
    saveApiKey,
    deleteApiKey,
    getApiKey,
    fetchApiKeys,
  };
};

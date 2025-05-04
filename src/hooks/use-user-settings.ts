
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserSettings } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message || "Ocorreu um erro ao carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!user || !settings) return;
    
    try {
      const { error } = await supabase
        .from("user_settings")
        .update(updatedSettings)
        .eq("id", settings.id);

      if (error) throw error;
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
      
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message || "Ocorreu um erro ao atualizar as configurações.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    fetchSettings,
  };
};

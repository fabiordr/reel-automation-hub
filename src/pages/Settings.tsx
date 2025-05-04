
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useUserSettings } from "@/hooks/use-user-settings";
import { Eye, EyeOff } from "lucide-react";

const Settings = () => {
  const { apiKeys, loading: loadingKeys, saveApiKey } = useApiKeys();
  const { settings, loading: loadingSettings, updateSettings } = useUserSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Estado para os valores dos inputs de API keys
  const [apiKeyValues, setApiKeyValues] = useState<Record<string, string>>({
    openai: '',
    elevenlabs: '',
    google: '',
    replicate: '',
    meta: '',
    youtube: '',
    tiktok: '',
  });

  // Estado para preferências do usuário
  const [userPreferences, setUserPreferences] = useState({
    preferred_tts: '',
    preferred_image_generator: '',
    preferred_video_generator: '',
    automation_service: ''
  });

  // Preencher os campos quando os dados forem carregados
  useEffect(() => {
    if (apiKeys && apiKeys.length > 0) {
      const keyMap: Record<string, string> = {};
      apiKeys.forEach(key => {
        keyMap[key.service] = key.api_key;
      });
      
      setApiKeyValues(prev => ({
        ...prev,
        openai: keyMap.openai || '',
        elevenlabs: keyMap.elevenlabs || '',
        google: keyMap.google || '',
        replicate: keyMap.replicate || '',
        meta: keyMap.meta || '',
        youtube: keyMap.youtube || '',
        tiktok: keyMap.tiktok || '',
      }));
    }
  }, [apiKeys]);

  // Preencher as preferências quando as configurações forem carregadas
  useEffect(() => {
    if (settings) {
      setUserPreferences({
        preferred_tts: settings.preferred_tts || 'elevenlabs',
        preferred_image_generator: settings.preferred_image_generator || 'replicate',
        preferred_video_generator: settings.preferred_video_generator || 'ffmpeg',
        automation_service: settings.automation_service || 'make'
      });
    }
  }, [settings]);

  const toggleShowKey = (service: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleSaveApiKeys = async () => {
    setIsSaving(true);
    
    try {
      const promises = [];
      
      // Salvar apenas chaves não vazias
      if (apiKeyValues.openai) {
        promises.push(saveApiKey('openai', apiKeyValues.openai));
      }
      if (apiKeyValues.elevenlabs) {
        promises.push(saveApiKey('elevenlabs', apiKeyValues.elevenlabs));
      }
      if (apiKeyValues.google) {
        promises.push(saveApiKey('google', apiKeyValues.google));
      }
      if (apiKeyValues.replicate) {
        promises.push(saveApiKey('replicate', apiKeyValues.replicate));
      }
      if (apiKeyValues.meta) {
        promises.push(saveApiKey('meta', apiKeyValues.meta));
      }
      if (apiKeyValues.youtube) {
        promises.push(saveApiKey('youtube', apiKeyValues.youtube));
      }
      if (apiKeyValues.tiktok) {
        promises.push(saveApiKey('tiktok', apiKeyValues.tiktok));
      }
      
      await Promise.all(promises);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      await updateSettings(userPreferences);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingKeys || loadingSettings) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas integrações e preferências da plataforma.
        </p>
      </div>

      <Tabs defaultValue="ai-tools">
        <TabsList className="mb-4">
          <TabsTrigger value="ai-tools">Ferramentas de IA</TabsTrigger>
          <TabsTrigger value="social-media">Redes Sociais</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-tools">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveApiKeys(); }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>OpenAI</CardTitle>
                  <CardDescription>
                    Configure sua API da OpenAI para geração de roteiros e legendas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="openai-key"
                        type={showApiKeys.openai ? "text" : "password"}
                        value={apiKeyValues.openai}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, openai: e.target.value }))}
                        placeholder="sk-..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('openai')}
                      >
                        {showApiKeys.openai ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openai-model">Modelo Padrão</Label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger id="openai-model">
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>GPT-4</SelectLabel>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>GPT-3.5</SelectLabel>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ElevenLabs</CardTitle>
                  <CardDescription>
                    Configure sua API da ElevenLabs para geração de voz.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="elevenlabs-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="elevenlabs-key"
                        type={showApiKeys.elevenlabs ? "text" : "password"}
                        value={apiKeyValues.elevenlabs}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, elevenlabs: e.target.value }))}
                        placeholder="..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('elevenlabs')}
                      >
                        {showApiKeys.elevenlabs ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="elevenlabs-voice">Voz Padrão</Label>
                    <Select defaultValue="rachel">
                      <SelectTrigger id="elevenlabs-voice">
                        <SelectValue placeholder="Selecione uma voz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rachel">Rachel</SelectItem>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="antoni">Antoni</SelectItem>
                        <SelectItem value="bella">Bella</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Google Cloud TTS</CardTitle>
                  <CardDescription>
                    Alternativa para Text-to-Speech
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="google-key"
                        type={showApiKeys.google ? "text" : "password"}
                        value={apiKeyValues.google}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, google: e.target.value }))}
                        placeholder="..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('google')}
                      >
                        {showApiKeys.google ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="google-voice">Voz Padrão</Label>
                    <Select defaultValue="pt-BR-Wavenet-A">
                      <SelectTrigger id="google-voice">
                        <SelectValue placeholder="Selecione uma voz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR-Wavenet-A">pt-BR-Wavenet-A</SelectItem>
                        <SelectItem value="pt-BR-Wavenet-B">pt-BR-Wavenet-B</SelectItem>
                        <SelectItem value="pt-BR-Wavenet-C">pt-BR-Wavenet-C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Replicate (Stable Diffusion)</CardTitle>
                  <CardDescription>
                    Configurações para geração de imagens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="replicate-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="replicate-key"
                        type={showApiKeys.replicate ? "text" : "password"}
                        value={apiKeyValues.replicate}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, replicate: e.target.value }))}
                        placeholder="r8_..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('replicate')}
                      >
                        {showApiKeys.replicate ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="replicate-model">Modelo Padrão</Label>
                    <Select defaultValue="stability-ai/sdxl">
                      <SelectTrigger id="replicate-model">
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stability-ai/sdxl">Stable Diffusion XL</SelectItem>
                        <SelectItem value="stability-ai/sd-turbo">SD Turbo</SelectItem>
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="social-media">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveApiKeys(); }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Instagram / Facebook</CardTitle>
                  <CardDescription>
                    Configure suas credenciais do Meta Business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-app-id">App ID</Label>
                    <Input 
                      id="meta-app-id" 
                      placeholder="12345678901234" 
                      value={apiKeyValues.meta || ''}
                      onChange={(e) => setApiKeyValues(prev => ({ ...prev, meta: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-app-secret">App Secret</Label>
                    <div className="relative">
                      <Input
                        id="meta-app-secret"
                        type={showApiKeys.meta ? "text" : "password"}
                        placeholder="..."
                        value={apiKeyValues.meta || ''}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, meta: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('meta')}
                      >
                        {showApiKeys.meta ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>YouTube</CardTitle>
                  <CardDescription>
                    Credenciais para acesso à API do YouTube
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube-client-id">Client ID</Label>
                    <Input 
                      id="youtube-client-id" 
                      placeholder="..." 
                      value={apiKeyValues.youtube || ''}
                      onChange={(e) => setApiKeyValues(prev => ({ ...prev, youtube: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube-client-secret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="youtube-client-secret"
                        type={showApiKeys.youtube ? "text" : "password"}
                        placeholder="..."
                        value={apiKeyValues.youtube || ''}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, youtube: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('youtube')}
                      >
                        {showApiKeys.youtube ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TikTok</CardTitle>
                  <CardDescription>
                    Credenciais do TikTok Developer Portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-client-key">Client Key</Label>
                    <Input 
                      id="tiktok-client-key" 
                      placeholder="..." 
                      value={apiKeyValues.tiktok || ''}
                      onChange={(e) => setApiKeyValues(prev => ({ ...prev, tiktok: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-client-secret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="tiktok-client-secret"
                        type={showApiKeys.tiktok ? "text" : "password"}
                        placeholder="..."
                        value={apiKeyValues.tiktok || ''}
                        onChange={(e) => setApiKeyValues(prev => ({ ...prev, tiktok: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleShowKey('tiktok')}
                      >
                        {showApiKeys.tiktok ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Configurações gerais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Ferramentas Preferidas</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferred-tts">Text-to-Speech</Label>
                    <Select 
                      value={userPreferences.preferred_tts}
                      onValueChange={(value) => setUserPreferences(prev => ({ ...prev, preferred_tts: value }))}
                    >
                      <SelectTrigger id="preferred-tts">
                        <SelectValue placeholder="Selecionar ferramenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="google">Google Cloud TTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-image">Geração de Imagem</Label>
                    <Select 
                      value={userPreferences.preferred_image_generator}
                      onValueChange={(value) => setUserPreferences(prev => ({ ...prev, preferred_image_generator: value }))}
                    >
                      <SelectTrigger id="preferred-image">
                        <SelectValue placeholder="Selecionar ferramenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="replicate">Replicate</SelectItem>
                        <SelectItem value="unsplash">Unsplash API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-video">Geração de Vídeo</Label>
                    <Select 
                      value={userPreferences.preferred_video_generator}
                      onValueChange={(value) => setUserPreferences(prev => ({ ...prev, preferred_video_generator: value }))}
                    >
                      <SelectTrigger id="preferred-video">
                        <SelectValue placeholder="Selecionar ferramenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ffmpeg">FFmpeg Local</SelectItem>
                        <SelectItem value="remotion">Remotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Configurações de Workflow</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="automation-service">Serviço de Automação</Label>
                    <Select 
                      value={userPreferences.automation_service}
                      onValueChange={(value) => setUserPreferences(prev => ({ ...prev, automation_service: value }))}
                    >
                      <SelectTrigger id="automation-service">
                        <SelectValue placeholder="Selecionar serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="make">Make.com</SelectItem>
                        <SelectItem value="n8n">n8n</SelectItem>
                        <SelectItem value="none">Nenhum (processar localmente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSavePreferences} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Preferências"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;


import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular salvamento no Supabase
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configurações salvas",
        description: "Suas alterações foram salvas com sucesso.",
      });
    }, 1000);
  };

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
          <form onSubmit={handleSaveSettings}>
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
                    <Input id="openai-key" type="password" placeholder="sk-..." />
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
                    <Input id="elevenlabs-key" type="password" placeholder="..." />
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
                    <Input id="google-key" type="password" placeholder="..." />
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
                    <Input id="replicate-key" type="password" placeholder="r8_..." />
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
          <form onSubmit={handleSaveSettings}>
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
                    <Input id="meta-app-id" placeholder="12345678901234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-app-secret">App Secret</Label>
                    <Input id="meta-app-secret" type="password" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-access-token">Access Token</Label>
                    <Input id="meta-access-token" type="password" placeholder="..." />
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
                    <Input id="youtube-client-id" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube-client-secret">Client Secret</Label>
                    <Input id="youtube-client-secret" type="password" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube-refresh-token">Refresh Token</Label>
                    <Input id="youtube-refresh-token" type="password" placeholder="..." />
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
                    <Input id="tiktok-client-key" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-client-secret">Client Secret</Label>
                    <Input id="tiktok-client-secret" type="password" placeholder="..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok-access-token">Access Token</Label>
                    <Input id="tiktok-access-token" type="password" placeholder="..." />
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
                    <Select defaultValue="elevenlabs">
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
                    <Select defaultValue="replicate">
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
                    <Select defaultValue="ffmpeg">
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
                    <Select defaultValue="make">
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
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Preferências"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;


export type UserProfile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export type ApiKey = {
  id: string;
  user_id: string;
  service: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export type Topic = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'canceled' | string; // Adicionado string para compatibilidade
  created_at: string;
  updated_at: string;
}

export type Video = {
  id: string;
  topic_id: string;
  user_id: string;
  title: string;
  script: string | null;
  audio_url: string | null;
  image_url: string | null;
  video_url: string | null;
  status: 'script' | 'voice' | 'image' | 'editing' | 'published' | 'failed' | string; // Adicionado string para compatibilidade
  error_message: string | null;
  published_platforms: string[] | any;
  views: Record<string, number> | any;
  cost: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export type UserSettings = {
  id: string;
  user_id: string;
  preferred_tts: string;
  preferred_image_generator: string;
  preferred_video_generator: string;
  automation_service: string;
  created_at: string;
  updated_at: string;
}

export type VideoStep = {
  id: string;
  video_id: string;
  step_name: 'script' | 'voice' | 'image' | 'editing' | 'publishing' | string; // Adicionado string para compatibilidade
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | string; // Adicionado string para compatibilidade
  updated_at: string;
  metadata: Record<string, any> | any; // Adicionado 'any' para compatibilidade com Json do Supabase
}

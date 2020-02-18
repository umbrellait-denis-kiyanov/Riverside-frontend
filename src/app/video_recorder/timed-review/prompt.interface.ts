import { SafeHtml } from '@angular/platform-browser';

export interface Prompt {
  time_limit?: number;
  time_to_prepare?: number;
  time_pause?: number;
  type: string;
  prompt?: SafeHtml | string;
  videoUrl?: string;
  videoThumbnailUrl?: string;
  audioUrl?: string;
  isInformation?: boolean;
}

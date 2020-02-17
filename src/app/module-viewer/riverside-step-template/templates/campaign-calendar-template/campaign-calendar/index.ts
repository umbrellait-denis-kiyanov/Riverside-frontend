import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

export interface Campaign {
  id: string;
  theme: string;
  persona?: number[];
  messaging?: string;
  tacticalMap?: string;
  startDate?: string;
  endDate?: string;
  assigned?: string;
  color?: string;
  offset?: SafeStyle;
  width?: SafeStyle;
}

export interface CampaignGraph {
  [key: string]: Campaign[];
}

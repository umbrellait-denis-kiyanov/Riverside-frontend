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
}

export interface CampaignGraph {
  [key: string]: Campaign[];
}

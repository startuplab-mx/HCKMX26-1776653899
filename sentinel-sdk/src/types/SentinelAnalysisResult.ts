import type { RiskLevel } from "./SentinelEngine.js";

export type { RiskLevel };

export type Stage =
  | "NINGUNA"
  | "CAPTACION"
  | "INDUCCION/COOPTACION"
  | "INCUBACION"
  | "UTILIZACION/INSTRUMENTALIZACION";

export type UXRecommendation =
  | "NONE"
  | "SOFT_NUDGE"
  | "WARNING_OVERLAY"
  | "SOFT_BLOCK"
  | "HARD_BLOCK";

export interface SentinelAnalysisResponse {
  score: number;
  risk: RiskLevel;
  escalate: boolean;
  stage: Stage;
  ux_recommendation: UXRecommendation;

  layers: {
    normalizer: {
      score: number;
      features: string[];
      triggeredRules: string[];
      transformations: string[];
    };
    v3: {
      score: number;
      terms: string[];
      categories: string[];
      triggeredRules: string[];
    };
    v4: {
      score: number;
      features: string[];
      triggeredRules: string[];
      explicitSignals: string[];
    };
  };

  velocityFlag: boolean;
  velocityWindow: number;
  messagesAnalyzed: number;
  uniqueCategories: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  status_code: number;
  details?: string;
}

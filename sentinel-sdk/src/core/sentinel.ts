import request from "../lib/request.js";
import { Engine } from "../analyzer/engine.js";
import { SentinelConfig } from "../types/SentinelConfig.js";
import { SentinelAnalysisResponse } from "../types/SentinelAnalysisResult.js";
import { SentinelResult, ok, err } from "../types/SentinelResult.js";
import { ApiMessage, EngineResult } from "../types/SentinelEngine.js";
import { SentinelError } from "../errors/SentinelError.js";

export class Sentinel {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private engine: Engine;

  constructor(config: SentinelConfig) {
    this.apiKey = config.apiKey;
    // this.baseUrl = "https://sentinel-api-production-95e9.up.railway.app/api/v1";
    this.baseUrl = "http://192.168.1.141:8000/api/v1";
    this.engine = new Engine();
  }

  /**
   * Analyzes the given text and returns the analysis result.
   * @param text The text to analyze.
   * @param sessionId The session ID.
   * @param userId The user ID.
   * @returns A SentinelResult — check `error` before using `data`.
   * @example
   * const { data, error } = await sentinel.analyze(text, sessionId, userId);
   * if (error) console.log(error.code, error.message);
   * else console.log(data.risk, data.stage);
   */
  async analyze(
    text: string,
    sessionId: string,
    userId: string,
  ): Promise<SentinelResult<SentinelAnalysisResponse>> {
    try {
      if (!text || !sessionId || !userId) {
        return err(
          new SentinelError(
            "Missing required parameters for analysis",
            "VALIDATION_ERROR",
          ),
        );
      }

      const messages = await this.syncSession(text, sessionId, userId);

      // 2. ANALYZE SESSION LOCALLY
      const engineMessages = messages.map((m) => ({
        text: m.content,
        timestamp: m.timestamp,
      }));
      const result = this.engine.analyze(engineMessages);

      // 3. DETERMINE ACTION BASED ON SCORE
      if (result.score <= 11) {
        return ok(this.toResponse(result, "NINGUNA", "NONE"));
      } else if (result.score > 11 && result.score <= 19) {
        // 4. ESCALATE IF NEEDED
        const escalated = await this.escalate(result, messages);
        return ok(escalated);
      } else {
        return ok(this.toResponse(result, "CAPTACION", "NONE"));
      }
    } catch (e) {
      if (e instanceof SentinelError) return err(e);
      return err(
        new SentinelError(
          e instanceof Error ? e.message : "Unknown error",
          "UNKNOWN_ERROR",
        ),
      );
    }
  }

  /**
   * Analyzes a single message locally without session context or AI escalation.
   * @param text The text to analyze.
   * @returns A SentinelResult — check `error` before using `data`.
   */
  analyzeMessage(text: string): SentinelResult<SentinelAnalysisResponse> {
    try {
      if (!text) {
        return err(
          new SentinelError(
            "Missing required text for analysis",
            "VALIDATION_ERROR",
          ),
        );
      }

      const result = this.engine.analyze([
        { text, timestamp: Date.now() },
      ]);

      if (result.score <= 11) {
        return ok(this.toResponse(result, "NINGUNA", "NONE"));
      } else {
        return ok(this.toResponse(result, "CAPTACION", "NONE"));
      }
    } catch (e) {
      if (e instanceof SentinelError) return err(e);
      return err(
        new SentinelError(
          e instanceof Error ? e.message : "Unknown error",
          "UNKNOWN_ERROR",
        ),
      );
    }
  }

  /** Maps an EngineResult to the public SentinelAnalysisResponse. */
  private toResponse(
    result: EngineResult,
    stage: SentinelAnalysisResponse["stage"],
    ux: SentinelAnalysisResponse["ux_recommendation"],
  ): SentinelAnalysisResponse {
    return {
      score: result.score,
      risk: result.risk,
      escalate: result.escalate,
      stage,
      ux_recommendation: ux,
      layers: result.layers,
      velocityFlag: result.velocityFlag,
      velocityWindow: result.velocityWindow,
      messagesAnalyzed: result.messagesAnalyzed,
      uniqueCategories: result.uniqueCategories,
    };
  }

  private async escalate(
    analysis: EngineResult,
    messages: ApiMessage[],
  ): Promise<SentinelAnalysisResponse> {
    return await request.post<SentinelAnalysisResponse>(
      `${this.baseUrl}/analyze`,
      { analysis, messages },
    );
  }

  private async syncSession(
    text: string,
    sessionId: string,
    userId: string,
  ): Promise<ApiMessage[]> {
    return await request.post<ApiMessage[]>(`${this.baseUrl}/messages/sync`, {
      message: {
        session_id: sessionId,
        user_id: userId,
        content: text,
        timestamp: new Date().getTime(),
      },
    });
  }
}

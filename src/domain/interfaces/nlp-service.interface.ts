export interface NLPService {
  analyze(
    text: string,
    context?: any,
  ): Promise<{
    intent: string;
    entities: Record<string, any>;
  }>;
}

import { Injectable } from '@nestjs/common';
import { NLPService } from '../../domain/interfaces/nlp-service.interface';

@Injectable()
export class OpenAINLPService implements NLPService {
  async analyze(
    text: string,
    context?: any,
  ): Promise<{ intent: string; entities: Record<string, any> }> {
    await Promise.resolve(); // evita warning do linter

    console.log('Analisando texto (stub NLP):', text, 'com contexto:', context);

    return {
      intent: 'UNKNOWN',
      entities: {},
    };
  }
}

export class RecurrenceVO {
  constructor(public readonly pattern: string) {
    // Exemplo simples: daily, weekly, monthly
    if (!pattern) {
      throw new Error('Recurrence pattern cannot be empty');
    }
  }
}

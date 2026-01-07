export type PriorityLevel = 'low' | 'medium' | 'high';

export class PriorityVO {
  constructor(public readonly level: PriorityLevel) {
    if (!['low', 'medium', 'high'].includes(level)) {
      throw new Error('Invalid priority level');
    }
  }
}

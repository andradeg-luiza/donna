export class DateTimeVO {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error('Invalid DateTime value');
    }
  }
}

export class Reminder {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public remindAt: Date,
    public recurrence: string | null, // depois vira Value Object
  ) {}
}

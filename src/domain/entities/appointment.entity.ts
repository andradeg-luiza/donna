export class Appointment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public startDateTime: Date,
    public endDateTime: Date | null,
    public recurrence: string | null, // depois vira Value Object
  ) {}
}

export type TaskStatus = 'pending' | 'done' | 'cancelled';

export class Task {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public description: string | null,
    public priority: string | null, // depois vira Value Object
    public dueDateTime: Date | null,
    public status: TaskStatus = 'pending',
  ) {}
}

export class User {
  constructor(
    public readonly id: string,
    public readonly whatsappId: string,
    public name?: string,
  ) {}
}

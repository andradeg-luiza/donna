export class List {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public type: string | null, // ex: shopping, todo, custom
  ) {}
}

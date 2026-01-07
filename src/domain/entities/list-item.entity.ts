export class ListItem {
  constructor(
    public readonly id: string,
    public readonly listId: string,
    public description: string,
    public quantity: number | null,
    public checked: boolean = false,
  ) {}
}

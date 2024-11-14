type AvailableItems = 'Water' | 'Food' | 'Medication' | 'C-Virus Vaccine';

export class ItemDto {
  public itemId: number;
  public quantity: number;
  public name: AvailableItems;
}

import { ItemDto } from "./item.dto";

export class ExchangeDto {
  public survivorId: number;
  public targetSurvivorId: number;
  public itemsToExchange: ItemDto[];
};

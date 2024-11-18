import { ItemDto } from "./item.dto";

export class ExchangeDto {
  public survivorId: number;
  public requesterSurvivorId: number;
  public itemToExchange: ItemDto;
};

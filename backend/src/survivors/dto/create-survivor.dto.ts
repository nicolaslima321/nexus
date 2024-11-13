import { genderEnum } from "src/enums";

export class CreateSurvivorDto {
  public name: string;
  public age: number;
  public gender: genderEnum;
  public lastLocation: JSON;
  public infected: boolean;
}

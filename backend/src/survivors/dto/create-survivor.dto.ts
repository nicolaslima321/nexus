import { genderEnum } from "src/enums";

export class CreateSurvivorDto {
  public age: number;
  public email: string;
  public gender: genderEnum;
  public infected: boolean;
  public lastLocation: JSON;
  public name: string;
  public password: string;
  public passwordConfirmation: string;
}

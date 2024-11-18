import { genderEnum } from "src/enums";

export class CreateSurvivorDto {
  public age: number;
  public email?: string;
  public gender: genderEnum;
  public infected: boolean;
  public lastLocation: {
    latitude: number;
    longitude: number;
  };
  public name: string;
  public password?: string;
  public passwordConfirmation?: string;
  public skipAccountCreation?: boolean;
}

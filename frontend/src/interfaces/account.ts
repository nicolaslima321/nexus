import { ISurvivor } from "./survivor";

export interface IAccount {
  id?: number;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IAccountResponseData {
  accessToken?: string;
  survivor: ISurvivor;
  message: string;
};

import { IInventory } from "./inventory";

export interface ISurvivor {
  id?: number;
  age: number;
  name: string;
  gender: string;
  infected: boolean;
  latitude?: number;
  longitude?: number;
  lastLocation?: {
    latitude: number | string,
    longitude: number | string,
  },
  status: string;
  inventory?: IInventory[] | [];
}

export type ISurvivorRequestData  = {
  skipAccountCreation?: boolean;
} & ISurvivor;

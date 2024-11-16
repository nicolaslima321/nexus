"use server";

import { ISurvivor } from "~/interfaces";
import HttpService from "~/services/HttpService";

export async function createSurvivor(data: ISurvivor) {
  return await HttpService.post('/survivors', data);
};

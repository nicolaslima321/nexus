"use server";

import { ISurvivor } from "~/interfaces";
import HttpService from "~/services/HttpService";

interface ISurvivorObject {
  login: string;
  password: string;
}

interface IBaseResponse {
  message: string;
};

interface ILoginReponse {
  accessToken: string;
  message: string;
}

export async function performCreation(survivor: ISurvivor): Promise<IBaseResponse> {
  return await HttpService.post('/survivors', survivor);
};

export async function performLogin(survivorLogin: ISurvivorObject): Promise<ILoginReponse> {
  return await HttpService.post('/auth/login', survivorLogin);
};

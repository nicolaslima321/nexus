"use server";

import HttpService from "~/services/HttpService";

interface ISurvivorObject {
  login: string;
  password: string;
}

interface ILoginReponse {
  accessToken: string;
  survivorId: number;
  message: string;
}

export async function performLogin(
  survivorLogin: ISurvivorObject,
): Promise<ILoginReponse> {
  return await HttpService.post("/auth/login", survivorLogin);
}

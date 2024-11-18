"use server";

import { ISurvivor } from "~/interfaces";
import HttpService from "~/services/HttpService";

export async function createSurvivor(data: ISurvivor) {
  return await HttpService.post("/survivors", data);
}

export async function getSurvivor(id: number) {
  return await HttpService.get(`/survivors/${id}`);
}

export async function getSurvivorsReports() {
  return await HttpService.get("/survivors/reports");
}

export async function fetchSurvivors() {
  return await HttpService.get("/survivors");
}

export async function addItemOnInventory(id: number, data) {
  return await HttpService.post(`/survivors/${id}/inventory/add`, data);
}

export async function exchangeItems(data) {
  return await HttpService.post(`/survivors/inventory/exchange`, data);
}

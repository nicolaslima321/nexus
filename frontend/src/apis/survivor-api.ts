"use server";

import { ISurvivor } from "~/interfaces";
import HttpService from "~/services/HttpService";

export async function createSurvivor(data: ISurvivor) {
  return await HttpService.post('/survivors', data);
};

export async function getSurvivor(id: number) {
  return await HttpService.get(`/survivors/${id}`);
};

export async function updateSurvivor(id: number, data: ISurvivor) {
  return await HttpService.patch(`/survivors/${id}`, data);
};

export async function getSurvivorsReports() {
  return await HttpService.get('/survivors/reports');
}

export async function fetchSurvivors() {
  return await HttpService.get('/survivors');
};


import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { backendDSN } from "../settings/settings";
import { ApiResponse } from "./types";

export const get = async (url: string, config?: AxiosRequestConfig): Promise<ApiResponse<any>> => {
  const response: AxiosResponse<any> = await axios.get(backendDSN() + `${url}`, config);
  return { data: response.data, status: response.status };
}

export const post = async (url: string, data?: Object, config?: AxiosRequestConfig): Promise<ApiResponse<any>> => {
  const response: AxiosResponse<any> = await axios.post(backendDSN() + `${url}`, data, {
    headers: {"Content-Type": "application/json"}, ...config});
  return { data: response.data, status: response.status };
}

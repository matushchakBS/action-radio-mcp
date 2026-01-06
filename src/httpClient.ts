import axios, { AxiosError, AxiosInstance } from 'axios';
import { httpTimeoutMs } from './config.js';
import { getDynamicApiBaseUrl } from './dynamicConfig.js';

// Create a wrapper that builds the URL dynamically
class DynamicApiClient {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      timeout: httpTimeoutMs,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  private getFullUrl(path: string) {
    const baseUrl = getDynamicApiBaseUrl();
    // The path from tools is like /assets, /episodes/{id}, etc
    // The baseUrl already includes /api/episode-manager
    // So we need to combine them properly
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
  
  async get(path: string, config?: any) {
    return this.axiosInstance.get(this.getFullUrl(path), config);
  }
  
  async post(path: string, data?: any, config?: any) {
    return this.axiosInstance.post(this.getFullUrl(path), data, config);
  }
  
  async put(path: string, data?: any, config?: any) {
    return this.axiosInstance.put(this.getFullUrl(path), data, config);
  }
  
  async delete(path: string, config?: any) {
    return this.axiosInstance.delete(this.getFullUrl(path), config);
  }
  
  async patch(path: string, data?: any, config?: any) {
    return this.axiosInstance.patch(this.getFullUrl(path), data, config);
  }
}

export const api = new DynamicApiClient();

export const serializeHttpError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  return { message: 'Unknown error', value: error };
};


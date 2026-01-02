import axios from 'axios';
import { apiBaseUrl, httpTimeoutMs } from './config.js';
export const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: httpTimeoutMs,
    headers: { 'Content-Type': 'application/json' },
});
export const serializeHttpError = (error) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
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
//# sourceMappingURL=httpClient.js.map
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

export class ApiClient {
    private axios: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        this.axios = axios.create(config);
        this.setUp()
    }

    public get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.axios.get(url, config);
    }

    public post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
        return this.axios.post(url, data, config);
    }

    public delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.axios.delete(url, config);
    }

    private setUp() {
        this.axios.interceptors.response.use(
            (response) => response,
            ApiClient.onRejectLogError
        );
    }

    private static onRejectLogError(error: any) {
        let errorMessage = 'An error has occurred during BRC API communication. Please see more details below:';

        if (error.response) {
            errorMessage += `\nResponse: ${JSON.stringify(error.response.data, null, 2)} `;
            errorMessage += `\nStatus: ${JSON.stringify(error.response.status, null, 2)}`;
            errorMessage += `\nHeaders: ${JSON.stringify(error.response.headers, null, 2)}`;
        } else if (error.request) {
            errorMessage += 'No response received.';
        } else {
            errorMessage += `Unknown error: ${error.message}`;
        }
        errorMessage += `\nRequest Config: ${JSON.stringify(error.config, null, 2)}`;

        return Promise.reject(new Error(errorMessage));
    }
}
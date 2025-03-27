const BASE_URL = import.meta.env.VITE_API_URL;

interface ApiError {
  status: number;
  message: string;
}

class ApiClient {
  private static instance: ApiClient;
  
  private constructor() {}

  static getInstance(): ApiClient {
    if (!this.instance) {
      this.instance = new ApiClient();
    }
    return this.instance;
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw await this.handleError(response);
      }
      return response.json();
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      if (!response.ok) {
        throw await this.handleError(response);
      }
      return response.json();
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw await this.handleError(response);
      }
      return response.json();
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private async handleError(response: Response): Promise<ApiError> {
    const error: ApiError = {
      status: response.status,
      message: 'An error occurred',
    };
    
    try {
      const data = await response.json();
      error.message = data.detail || data.message || error.message;
    } catch {
      error.message = response.statusText;
    }
    
    return error;
  }

  private normalizeError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'status' in error) {
      return error as ApiError;
    }
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export const apiClient = ApiClient.getInstance();
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Utility functions for creating standardized API responses
 */
export class ResponseUtil {
  /**
   * Create a success response
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an error response
   */
  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}


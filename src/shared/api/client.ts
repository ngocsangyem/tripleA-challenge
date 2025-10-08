import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios'
import type { ApiError } from '@/shared/types'

/**
 * API base URL
 * - In development: Uses Vite proxy (/api) to avoid CORS issues
 * - In production: Uses environment variable or defaults to relative path
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Create axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  /**
   * Response interceptor for success responses
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: AxiosError) => {
      return Promise.reject(transformError(error))
    }
  )

  return client
}

/**
 * Transform axios error into application error format
 */
const transformError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message: extractErrorMessage(error.response.data),
      status: error.response.status,
      code: error.code,
      details: error.response.data as Record<string, unknown>,
    }
  }

  if (error.request) {
    return {
      message: 'No response from server. Please check if the API server is running.',
      code: error.code,
    }
  }

  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
  }
}

/**
 * Extract error message from response data
 */
const extractErrorMessage = (data: unknown): string => {
  if (!data) {
    return 'An error occurred'
  }

  if (typeof data === 'string') {
    return data
  }

  if (typeof data === 'object' && data !== null) {
    const errorData = data as Record<string, unknown>
    
    if (typeof errorData.message === 'string') {
      return errorData.message
    }
    
    if (typeof errorData.error === 'string') {
      return errorData.error
    }
    
    if (typeof errorData.detail === 'string') {
      return errorData.detail
    }
  }

  return 'An error occurred'
}

export const apiClient = createApiClient()

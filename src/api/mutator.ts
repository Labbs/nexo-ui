import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './client'

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  // Orval generates full paths from the spec (e.g., /api/v1/actions/)
  // so we override baseURL to avoid double-prefixing
  return apiClient({ ...config, baseURL: '' }).then(({ data }) => data)
}

/**
 * 공통 API 응답 및 페이지네이션 타입 정의
 */

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

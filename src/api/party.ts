import { supabase } from '../lib/supabase'
import type { Party } from '../models/party'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../models/common'

export const getParties = async (params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<Party>>> => {
  try {
    const { page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    const { count, error: countError } = await supabase
      .from('PARTY')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      return {
        data: null,
        error: `파티 개수 조회 중 오류가 발생했습니다: ${countError.message}`,
        success: false
      }
    }

    const { data, error } = await supabase
      .from('PARTY')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return {
        data: null,
        error: `파티 목록 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false
      }
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: {
        data,
        total: count || 0,
        page,
        limit,
        totalPages
      },
      error: null,
      success: true
    }
  } catch (error) {
    return {
      data: null,
      error: `파티 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
}


import { supabase } from '../lib/supabase'
import { getAnonymousUserId } from '../stores/auth'
import { checkCooldown, setLastActionTime, CooldownError } from '../stores/cooldown'
import type { CheerNote, CreateCheerNoteInput } from '../models/cheer-note'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../models/common'

export const createCheerNote = async (input: CreateCheerNoteInput): Promise<ApiResponse<CheerNote>> => {
  try {
    const userId = getAnonymousUserId()
    
    const cooldownCheck = checkCooldown(userId, 'cheer_note')
    if (!cooldownCheck.canExecute) {
      throw new CooldownError('cheer_note', cooldownCheck.remainingMs)
    }

    if (!input.message || input.message.trim().length === 0) {
      return {
        data: null,
        error: '응원 메시지를 입력해주세요.',
        success: false
      }
    }

    if (input.message.length > 500) {
      return {
        data: null,
        error: '응원 메시지는 500자 이하로 입력해주세요.',
        success: false
      }
    }

    if (!input.user_name || input.user_name.trim().length === 0) {
      return {
        data: null,
        error: '닉네임을 입력해주세요.',
        success: false
      }
    }

    if (input.user_name.length > 20) {
      return {
        data: null,
        error: '닉네임은 20자 이하로 입력해주세요.',
        success: false
      }
    }

    const { data: partyExists, error: partyError } = await supabase
      .from('PARTY')
      .select('id')
      .eq('id', input.party_id)
      .single()

    if (partyError || !partyExists) {
      return {
        data: null,
        error: '존재하지 않는 파티입니다.',
        success: false
      }
    }

    const { data, error } = await supabase
      .from('CHEER_NOTE')
      .insert([{
        party_id: input.party_id,
        user_id: userId,
        user_name: input.user_name.trim(),
        message: input.message.trim(),
        is_deleted: false
      }])
      .select()
      .single()

    if (error) {
      return {
        data: null,
        error: `응원 메시지 작성 중 오류가 발생했습니다: ${error.message}`,
        success: false
      }
    }

    setLastActionTime(userId, 'cheer_note')

    return {
      data,
      error: null,
      success: true
    }
  } catch (error) {
    if (error instanceof CooldownError) {
      return {
        data: null,
        error: error.message,
        success: false
      }
    }

    return {
      data: null,
      error: `응원 메시지 작성 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
}

/**
 * 특정 파티의 응원 메시지 목록을 조회합니다 (페이지네이션 지원)
 */
export const getCheerNotesByPartyId = async (
  partyId: number, 
  params: PaginationParams = {}
): Promise<ApiResponse<PaginatedResponse<CheerNote>>> => {
  try {
    const { page = 1, limit = 20 } = params
    const offset = (page - 1) * limit

    const { count, error: countError } = await supabase
      .from('CHEER_NOTE')
      .select('*', { count: 'exact', head: true })
      .eq('party_id', partyId)
      .eq('is_deleted', false)

    if (countError) {
      return {
        data: null,
        error: `응원 메시지 개수 조회 중 오류가 발생했습니다: ${countError.message}`,
        success: false
      }
    }

    const { data, error } = await supabase
      .from('CHEER_NOTE')
      .select('*')
      .eq('party_id', partyId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return {
        data: null,
        error: `응원 메시지 목록 조회 중 오류가 발생했습니다: ${error.message}`,
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
      error: `응원 메시지 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
}

/**
 * 특정 사용자가 작성한 응원 메시지 목록을 조회합니다
 */
export const getCheerNotesByUserId = async (
  userId?: string,
  params: PaginationParams = {}
): Promise<ApiResponse<PaginatedResponse<CheerNote>>> => {
  try {
    const targetUserId = userId || getAnonymousUserId()
    const { page = 1, limit = 20 } = params
    const offset = (page - 1) * limit

    const { count, error: countError } = await supabase
      .from('CHEER_NOTE')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)
      .eq('is_deleted', false)

    if (countError) {
      return {
        data: null,
        error: `응원 메시지 개수 조회 중 오류가 발생했습니다: ${countError.message}`,
        success: false
      }
    }

    const { data, error } = await supabase
      .from('CHEER_NOTE')
      .select(`
        *,
        party:party_id (
          id,
          party_name,
          color
        )
      `)
      .eq('user_id', targetUserId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return {
        data: null,
        error: `응원 메시지 목록 조회 중 오류가 발생했습니다: ${error.message}`,
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
      error: `응원 메시지 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
}

/**
 * 특정 응원 메시지를 ID로 조회합니다
 */
export const getCheerNoteById = async (id: number): Promise<ApiResponse<CheerNote>> => {
  try {
    const { data, error } = await supabase
      .from('CHEER_NOTE')
      .select(`
        *,
        party:party_id (
          id,
          party_name,
          color
        )
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: '응원 메시지를 찾을 수 없습니다.',
          success: false
        }
      }

      return {
        data: null,
        error: `응원 메시지 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false
      }
    }

    return {
      data,
      error: null,
      success: true
    }
  } catch (error) {
    return {
      data: null,
      error: `응원 메시지 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
}

/**
 * 응원 메시지를 삭제합니다 (soft delete)
 */
export const deleteCheerNote = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const userId = getAnonymousUserId()

    // 먼저 해당 응원 메시지가 현재 사용자의 것인지 확인
    const { data: cheerNote, error: fetchError } = await supabase
      .from('CHEER_NOTE')
      .select('user_id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return {
          data: false,
          error: '응원 메시지를 찾을 수 없습니다.',
          success: false
        }
      }

      return {
        data: false,
        error: `응원 메시지 조회 중 오류가 발생했습니다: ${fetchError.message}`,
        success: false
      }
    }

    if (cheerNote.user_id !== userId) {
      return {
        data: false,
        error: '자신이 작성한 응원 메시지만 삭제할 수 있습니다.',
        success: false
      }
    }

    // Soft delete: is_deleted를 true로 업데이트
    const { error } = await supabase
      .from('CHEER_NOTE')
      .update({ is_deleted: true })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      return {
        data: false,
        error: `응원 메시지 삭제 중 오류가 발생했습니다: ${error.message}`,
        success: false
      }
    }

    return {
      data: true,
      error: null,
      success: true
    }
  } catch (error) {
    return {
      data: false,
      error: `응원 메시지 삭제 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false
    }
  }
} 
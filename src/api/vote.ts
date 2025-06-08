import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import {
  checkCooldown,
  setLastActionTime,
  CooldownError,
} from '@/stores/cooldown';
import type { Vote, CreateVoteInput } from '@/models/vote';
import type { Party } from '@/models/party';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/models/common';

export const createVote = async (
  input: CreateVoteInput,
): Promise<ApiResponse<Vote>> => {
  try {
    const userId = useAuthStore.getState().initAnonymousUserId();

    const cooldownCheck = checkCooldown(userId, 'vote');
    if (!cooldownCheck.canExecute) {
      throw new CooldownError('vote', cooldownCheck.remainingMs);
    }

    const { data: partyExists, error: partyError } = await supabase
      .from('PARTY')
      .select('id')
      .eq('id', input.party_id)
      .single();

    if (partyError || !partyExists) {
      return {
        data: null,
        error: '존재하지 않는 파티입니다.',
        success: false,
      };
    }

    const { data: existingVote, error: checkError } = await supabase
      .from('VOTE')
      .select('id')
      .eq('party_id', input.party_id)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .single();

    if (!checkError && existingVote) {
      return {
        data: null,
        error: '이미 이 파티에 좋아요를 눌렀습니다.',
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('VOTE')
      .insert([
        {
          party_id: input.party_id,
          user_id: userId,
          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: `좋아요 등록 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    setLastActionTime(userId, 'vote');

    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    if (error instanceof CooldownError) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: null,
      error: `좋아요 등록 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 좋아요를 취소합니다 (soft delete)
 */
export const deleteVote = async (
  input: CreateVoteInput,
): Promise<ApiResponse<Vote>> => {
  try {
    const userId = useAuthStore.getState().initAnonymousUserId();

    const cooldownCheck = checkCooldown(userId, 'vote');
    if (!cooldownCheck.canExecute) {
      throw new CooldownError('vote', cooldownCheck.remainingMs);
    }

    const { data: existingVote, error: checkError } = await supabase
      .from('VOTE')
      .select('id')
      .eq('party_id', input.party_id)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .single();

    if (checkError || !existingVote) {
      return {
        data: null,
        error: '삭제할 좋아요가 없습니다.',
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('VOTE')
      .update({ is_deleted: true })
      .eq('id', existingVote.id)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: `좋아요 삭제 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    setLastActionTime(userId, 'vote');

    return {
      data,
      error: null,
      success: true,
    };
  } catch (error) {
    if (error instanceof CooldownError) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: null,
      error: `좋아요 삭제 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

export const getVoteCountByPartyId = async (
  partyId: number,
): Promise<ApiResponse<number>> => {
  try {
    const { count, error } = await supabase
      .from('VOTE')
      .select('*', { count: 'exact', head: true })
      .eq('party_id', partyId)
      .eq('is_deleted', false);

    if (error) {
      return {
        data: null,
        error: `좋아요 개수 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    return {
      data: count || 0,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `좋아요 개수 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

export const getVoteByPartyId = async (
  partyId: number,
  params: PaginationParams = {},
): Promise<ApiResponse<PaginatedResponse<Vote>>> => {
  try {
    const { page = 1, limit = 50 } = params;
    const offset = (page - 1) * limit;

    const { count, error: countError } = await supabase
      .from('VOTE')
      .select('*', { count: 'exact', head: true })
      .eq('party_id', partyId)
      .eq('is_deleted', false);

    if (countError) {
      return {
        data: null,
        error: `좋아요 개수 조회 중 오류가 발생했습니다: ${countError.message}`,
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('VOTE')
      .select('*')
      .eq('party_id', partyId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return {
        data: null,
        error: `좋아요 목록 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: {
        data,
        total: count || 0,
        page,
        limit,
        totalPages,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `좋아요 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 사용자가 특정 파티에 좋아요를 눌렀는지 확인합니다
 */
export const checkUserVote = async (
  partyId: number,
  userId?: string,
): Promise<ApiResponse<boolean>> => {
  try {
    const targetUserId =
      userId || useAuthStore.getState().initAnonymousUserId();

    const { data, error } = await supabase
      .from('VOTE')
      .select('id')
      .eq('party_id', partyId)
      .eq('user_id', targetUserId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: false,
          error: null,
          success: true,
        };
      }

      return {
        data: null,
        error: `좋아요 확인 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    return {
      data: !!data,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `좋아요 확인 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 사용자가 좋아요를 누른 파티 목록을 조회합니다
 */
export const getUserVoteParties = async (
  userId?: string,
  params: PaginationParams = {},
): Promise<ApiResponse<PaginatedResponse<Vote & { party: Party }>>> => {
  try {
    const targetUserId =
      userId || useAuthStore.getState().initAnonymousUserId();
    const { page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    const { count, error: countError } = await supabase
      .from('VOTE')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)
      .eq('is_deleted', false);

    if (countError) {
      return {
        data: null,
        error: `좋아요한 파티 개수 조회 중 오류가 발생했습니다: ${countError.message}`,
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('VOTE')
      .select(
        `
        *,
        party:party_id (
          id,
          party_name,
          color,
          created_at
        )
      `,
      )
      .eq('user_id', targetUserId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return {
        data: null,
        error: `좋아요한 파티 목록 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      data: {
        data,
        total: count || 0,
        page,
        limit,
        totalPages,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `좋아요한 파티 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

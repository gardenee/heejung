import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import {
  checkCooldown,
  setLastActionTime,
  CooldownError,
} from '@/stores/cooldown';
import type {
  CheerNoteReaction,
  CreateCheerNoteReactionInput,
  CheerNoteReactionStats,
} from '@/models/cheer-note-reaction';
import type { ApiResponse } from '@/models/common';
import { CHEER_NOTE_REACTION_TYPES } from '@/constants/cheer-note-reaction';

export const createCheerNoteReaction = async (
  input: CreateCheerNoteReactionInput,
): Promise<ApiResponse<CheerNoteReaction>> => {
  try {
    const userId = useAuthStore.getState().initAnonymousUserId();

    const cooldownCheck = checkCooldown(userId, 'reaction');
    if (!cooldownCheck.canExecute) {
      throw new CooldownError('reaction', cooldownCheck.remainingMs);
    }

    if (
      !input.type ||
      input.type.trim().length === 0 ||
      !CHEER_NOTE_REACTION_TYPES.includes(
        input.type as (typeof CHEER_NOTE_REACTION_TYPES)[number],
      )
    ) {
      return {
        data: null,
        error: '리액션 타입을 입력해주세요.',
        success: false,
      };
    }

    // 응원 메시지 존재 여부 확인
    const { data: cheerNoteExists, error: cheerNoteError } = await supabase
      .from('CHEER_NOTE')
      .select('id')
      .eq('id', input.cheer_note_id)
      .eq('is_deleted', false)
      .single();

    if (cheerNoteError || !cheerNoteExists) {
      return {
        data: null,
        error: '존재하지 않는 응원 메시지입니다.',
        success: false,
      };
    }

    // 동일한 사용자의 동일한 응원 메시지에 대한 기존 리액션 확인
    const { data: existingReaction, error: existingError } = await supabase
      .from('CHEER_NOTE_REACTION')
      .select('*')
      .eq('cheer_note_id', input.cheer_note_id)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116: no rows found
      return {
        data: null,
        error: `기존 리액션 확인 중 오류가 발생했습니다: ${existingError.message}`,
        success: false,
      };
    }

    // 기존 리액션이 있는 경우 처리
    if (existingReaction) {
      // 같은 리액션인 경우 삭제 (토글) - soft delete
      if (existingReaction.type === input.type.trim()) {
        const { error: deleteError } = await supabase
          .from('CHEER_NOTE_REACTION')
          .update({ is_deleted: true })
          .eq('id', existingReaction.id);

        if (deleteError) {
          return {
            data: null,
            error: `리액션 삭제 중 오류가 발생했습니다: ${deleteError.message}`,
            success: false,
          };
        }

        return {
          data: null,
          error: null,
          success: true,
        };
      } else {
        // 다른 리액션인 경우 업데이트
        const { data, error } = await supabase
          .from('CHEER_NOTE_REACTION')
          .update({ type: input.type.trim() })
          .eq('id', existingReaction.id)
          .select()
          .single();

        if (error) {
          return {
            data: null,
            error: `리액션 업데이트 중 오류가 발생했습니다: ${error.message}`,
            success: false,
          };
        }

        setLastActionTime(userId, 'reaction');

        return {
          data,
          error: null,
          success: true,
        };
      }
    }

    // 새로운 리액션 생성
    const { data, error } = await supabase
      .from('CHEER_NOTE_REACTION')
      .insert([
        {
          cheer_note_id: input.cheer_note_id,
          user_id: userId,
          type: input.type.trim(),
          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: `리액션 생성 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    setLastActionTime(userId, 'reaction');

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
      error: `리액션 생성 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 응원 메시지의 리액션을 삭제합니다 (soft delete)
 */
export const deleteCheerNoteReaction = async (
  cheerNoteId: number,
): Promise<ApiResponse<boolean>> => {
  try {
    const userId = useAuthStore.getState().initAnonymousUserId();

    const { error } = await supabase
      .from('CHEER_NOTE_REACTION')
      .update({ is_deleted: true })
      .eq('cheer_note_id', cheerNoteId)
      .eq('user_id', userId)
      .eq('is_deleted', false);

    if (error) {
      return {
        data: false,
        error: `리액션 삭제 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    return {
      data: true,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: false,
      error: `리액션 삭제 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 응원 메시지의 리액션 통계를 조회합니다
 */
export const getCheerNoteReactionStats = async (
  cheerNoteId: number,
): Promise<ApiResponse<CheerNoteReactionStats>> => {
  try {
    const userId = useAuthStore.getState().initAnonymousUserId();

    const { data: reactions, error } = await supabase
      .from('CHEER_NOTE_REACTION')
      .select('type, user_id')
      .eq('cheer_note_id', cheerNoteId)
      .eq('is_deleted', false);

    if (error) {
      return {
        data: null,
        error: `리액션 통계 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    const reactionCounts: { [key: string]: number } = {};
    let userReaction: string | null = null;

    if (reactions) {
      reactions.forEach(reaction => {
        reactionCounts[reaction.type] =
          (reactionCounts[reaction.type] || 0) + 1;
        if (reaction.user_id === userId) {
          userReaction = reaction.type;
        }
      });
    }

    const stats: CheerNoteReactionStats = {
      cheer_note_id: cheerNoteId,
      reaction_counts: reactionCounts,
      total_reactions: reactions?.length || 0,
      user_reaction: userReaction,
    };

    return {
      data: stats,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `리액션 통계 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 여러 응원 메시지의 리액션 통계를 일괄 조회합니다
 */
export const getBulkCheerNoteReactionStats = async (
  cheerNoteIds: Array<number>,
): Promise<ApiResponse<Array<CheerNoteReactionStats>>> => {
  try {
    if (cheerNoteIds.length === 0) {
      return {
        data: [],
        error: null,
        success: true,
      };
    }

    const userId = useAuthStore.getState().initAnonymousUserId();

    // 모든 리액션 조회
    const { data: reactions, error } = await supabase
      .from('CHEER_NOTE_REACTION')
      .select('cheer_note_id, type, user_id')
      .in('cheer_note_id', cheerNoteIds)
      .eq('is_deleted', false);

    if (error) {
      return {
        data: null,
        error: `리액션 통계 일괄 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    // 응원 메시지별로 그룹화
    const statsByCheerNote: { [key: number]: CheerNoteReactionStats } = {};

    // 초기화
    cheerNoteIds.forEach(id => {
      statsByCheerNote[id] = {
        cheer_note_id: id,
        reaction_counts: {},
        total_reactions: 0,
        user_reaction: null,
      };
    });

    // 리액션 데이터 처리
    if (reactions) {
      reactions.forEach(reaction => {
        const stats = statsByCheerNote[reaction.cheer_note_id];
        if (stats) {
          stats.reaction_counts[reaction.type] =
            (stats.reaction_counts[reaction.type] || 0) + 1;
          stats.total_reactions++;

          if (reaction.user_id === userId) {
            stats.user_reaction = reaction.type;
          }
        }
      });
    }

    return {
      data: Object.values(statsByCheerNote),
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `리액션 통계 일괄 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

/**
 * 사용자의 리액션 목록을 조회합니다
 */
export const getUserCheerNoteReactions = async (
  userId?: string,
): Promise<ApiResponse<Array<CheerNoteReaction>>> => {
  try {
    const targetUserId =
      userId || useAuthStore.getState().initAnonymousUserId();

    const { data, error } = await supabase
      .from('CHEER_NOTE_REACTION')
      .select(
        `
        *,
        cheer_note:cheer_note_id (
          id,
          message,
          user_name,
          party_id,
          party:party_id (
            id,
            party_name,
            color
          )
        )
      `,
      )
      .eq('user_id', targetUserId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: `사용자 리액션 목록 조회 중 오류가 발생했습니다: ${error.message}`,
        success: false,
      };
    }

    return {
      data: data || [],
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: `사용자 리액션 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

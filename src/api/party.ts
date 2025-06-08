import { supabase } from '../lib/supabase';
import type { Party } from '../models/party';
import type { ApiResponse } from '../models/common';

export const getParties = async (): Promise<ApiResponse<Array<Party>>> => {
  try {
    const { data, error } = await supabase
      .from('PARTY')
      .select('*')
      .order('sort_seq', { ascending: true });

    if (error) {
      return {
        data: null,
        error: `파티 목록 조회 중 오류가 발생했습니다: ${error.message}`,
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
      error: `파티 목록 조회 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
};

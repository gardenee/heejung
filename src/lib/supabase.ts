import { createClient } from '@supabase/supabase-js';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 키를 가져옵니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabase 클라이언트를 생성합니다
// RLS(Row Level Security) 정책이 자동으로 적용됩니다
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // 자동 토큰 갱신 설정
    autoRefreshToken: true,
    // 세션 지속성 설정 (localStorage 사용)
    persistSession: true,
    // RLS 정책 적용을 위해 인증된 요청을 감지
    detectSessionInUrl: true,
  },
  db: {
    // RLS 정책이 적용된 쿼리를 실행하기 위한 설정
    schema: 'public',
  },
});

// 인증 상태 변화를 감지하는 헬퍼 함수
export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) => {
  return supabase.auth.onAuthStateChange(callback);
};

// 현재 사용자 정보를 가져오는 헬퍼 함수
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// 현재 세션을 가져오는 헬퍼 함수
export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }
  return session;
};

-- RLS (Row Level Security) 정책 설정
-- 이 파일의 SQL을 Supabase SQL Editor에서 실행하세요

-- 1. RLS 활성화
ALTER TABLE "PARTY" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CHEER_NOTE" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CHEER_NOTE_REACTION" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VOTE" ENABLE ROW LEVEL SECURITY;

-- 2. PARTY 테이블 정책
-- 모든 사용자가 파티를 조회할 수 있음
CREATE POLICY "Anyone can view parties" ON "PARTY"
    FOR SELECT USING (true);

-- 모든 사용자가 파티를 생성할 수 있음
CREATE POLICY "Anyone can create parties" ON "PARTY"
    FOR INSERT WITH CHECK (true);

-- 3. CHEER_NOTE 테이블 정책
-- 모든 사용자가 삭제되지 않은 응원 메시지를 조회할 수 있음
CREATE POLICY "Anyone can view active cheer notes" ON "CHEER_NOTE"
    FOR SELECT USING (is_deleted = false);

-- 모든 사용자가 응원 메시지를 생성할 수 있음
CREATE POLICY "Anyone can create cheer notes" ON "CHEER_NOTE"
    FOR INSERT WITH CHECK (true);

-- 사용자는 자신의 응원 메시지만 업데이트할 수 있음 (soft delete 포함)
CREATE POLICY "Users can update their own cheer notes" ON "CHEER_NOTE"
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 4. CHEER_NOTE_REACTION 테이블 정책
-- 모든 사용자가 삭제되지 않은 리액션을 조회할 수 있음
CREATE POLICY "Anyone can view active cheer note reactions" ON "CHEER_NOTE_REACTION"
    FOR SELECT USING (is_deleted = false);

-- 모든 사용자가 리액션을 생성할 수 있음
CREATE POLICY "Anyone can create cheer note reactions" ON "CHEER_NOTE_REACTION"
    FOR INSERT WITH CHECK (true);

-- 사용자는 자신의 리액션만 수정할 수 있음
CREATE POLICY "Users can update their own cheer note reactions" ON "CHEER_NOTE_REACTION"
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 5. VOTE 테이블 정책
-- 모든 사용자가 삭제되지 않은 좋아요를 조회할 수 있음
CREATE POLICY "Anyone can view active votes" ON "VOTE"
    FOR SELECT USING (is_deleted = false);

-- 모든 사용자가 좋아요를 생성할 수 있음
CREATE POLICY "Anyone can create votes" ON "VOTE"
    FOR INSERT WITH CHECK (true);

-- 사용자는 자신의 좋아요만 수정할 수 있음 (soft delete 포함)
CREATE POLICY "Users can update their own votes" ON "VOTE"
    FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 6. 인덱스 생성 (성능 최적화)
-- 파티 테이블
CREATE INDEX IF NOT EXISTS idx_party_created_at ON "PARTY"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_party_name ON "PARTY"(party_name);

-- 응원 메시지 테이블
CREATE INDEX IF NOT EXISTS idx_cheer_note_party_id ON "CHEER_NOTE"(party_id);
CREATE INDEX IF NOT EXISTS idx_cheer_note_user_id ON "CHEER_NOTE"(user_id);
CREATE INDEX IF NOT EXISTS idx_cheer_note_created_at ON "CHEER_NOTE"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cheer_note_is_deleted ON "CHEER_NOTE"(is_deleted);
CREATE INDEX IF NOT EXISTS idx_cheer_note_party_active ON "CHEER_NOTE"(party_id, is_deleted);

-- 응원 메시지 리액션 테이블
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_cheer_note_id ON "CHEER_NOTE_REACTION"(cheer_note_id);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_user_id ON "CHEER_NOTE_REACTION"(user_id);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_type ON "CHEER_NOTE_REACTION"(type);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_cheer_note_user ON "CHEER_NOTE_REACTION"(cheer_note_id, user_id);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_created_at ON "CHEER_NOTE_REACTION"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_is_deleted ON "CHEER_NOTE_REACTION"(is_deleted);
CREATE INDEX IF NOT EXISTS idx_cheer_note_reaction_cheer_note_active ON "CHEER_NOTE_REACTION"(cheer_note_id, is_deleted);

-- 좋아요 테이블
CREATE INDEX IF NOT EXISTS idx_vote_party_id ON "VOTE"(party_id);
CREATE INDEX IF NOT EXISTS idx_vote_user_id ON "VOTE"(user_id);
CREATE INDEX IF NOT EXISTS idx_vote_party_user ON "VOTE"(party_id, user_id);
CREATE INDEX IF NOT EXISTS idx_vote_is_deleted ON "VOTE"(is_deleted);
CREATE INDEX IF NOT EXISTS idx_vote_party_active ON "VOTE"(party_id, is_deleted);

-- 7. 실시간 구독을 위한 Publication 설정 (선택사항)
-- Supabase 실시간 기능을 사용하려면 다음을 실행하세요:
ALTER PUBLICATION supabase_realtime ADD TABLE "PARTY";
ALTER PUBLICATION supabase_realtime ADD TABLE "CHEER_NOTE";
ALTER PUBLICATION supabase_realtime ADD TABLE "CHEER_NOTE_REACTION";
ALTER PUBLICATION supabase_realtime ADD TABLE "VOTE";

-- 8. 함수 생성 (좋아요 개수 등)
CREATE OR REPLACE FUNCTION get_party_stats(party_id_param bigint)
RETURNS TABLE(
    vote_count bigint,
    cheer_notes_count bigint
) 
LANGUAGE sql
STABLE
AS $$
    SELECT 
        (SELECT COUNT(*) FROM "VOTE" WHERE party_id = party_id_param AND is_deleted = false) as vote_count,
        (SELECT COUNT(*) FROM "CHEER_NOTE" WHERE party_id = party_id_param AND is_deleted = false) as cheer_notes_count;
$$;

-- 응원 메시지 리액션 통계 함수
CREATE OR REPLACE FUNCTION get_cheer_note_reaction_stats(cheer_note_id_param bigint)
RETURNS TABLE(
    reaction_type text,
    reaction_count bigint
) 
LANGUAGE sql
STABLE
AS $$
    SELECT 
        type as reaction_type,
        COUNT(*) as reaction_count
    FROM "CHEER_NOTE_REACTION" 
    WHERE cheer_note_id = cheer_note_id_param AND is_deleted = false
    GROUP BY type
    ORDER BY reaction_count DESC;
$$;

-- 9. 트리거 함수 (created_at 자동 설정)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- created_at 트리거 생성
CREATE TRIGGER set_timestamp_party
    BEFORE INSERT ON "PARTY"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_cheer_note
    BEFORE INSERT ON "CHEER_NOTE"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_cheer_note_reaction
    BEFORE INSERT ON "CHEER_NOTE_REACTION"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_vote
    BEFORE INSERT ON "VOTE"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp(); 
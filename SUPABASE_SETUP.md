# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입 후 로그인
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 이름, 데이터베이스 비밀번호 설정

## 2. 환경변수 설정

`.env.local` 파일에서 다음 값들을 실제 Supabase 프로젝트 값으로 변경:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- `SUPABASE_URL`: Supabase 프로젝트 설정 > API > Project URL
- `SUPABASE_ANON_KEY`: Supabase 프로젝트 설정 > API > Project API keys > anon public

## 3. 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 쿼리를 실행:

```sql
-- BookingList 테이블 생성
CREATE TABLE "BookingList" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reserver_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_hours INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  selected_time_slots TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE "BookingList" ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 예약을 생성할 수 있도록 허용
CREATE POLICY "Allow insert for all users" ON "BookingList"
  FOR INSERT 
  WITH CHECK (true);

-- 모든 사용자가 예약을 조회할 수 있도록 허용
CREATE POLICY "Allow select for all users" ON "BookingList"
  FOR SELECT 
  USING (true);

-- 모든 사용자가 예약 상태를 업데이트할 수 있도록 허용 (예약 취소용)
CREATE POLICY "Allow update for all users" ON "BookingList"
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- updated_at 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_bookinglist_updated_at 
    BEFORE UPDATE ON "BookingList" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```
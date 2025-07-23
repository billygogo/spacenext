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

## 4. 테이블 구조 설명

- `id`: 예약 고유 ID (UUID)
- `reserver_name`: 예약자 이름
- `phone_number`: 예약자 연락처
- `booking_date`: 예약 날짜
- `start_time`: 시작 시간
- `end_time`: 종료 시간
- `total_hours`: 총 예약 시간
- `total_price`: 총 결제 금액
- `selected_time_slots`: 선택된 시간 슬롯 배열
- `status`: 예약 상태 (pending, confirmed, cancelled)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## 5. 테스트

애플리케이션에서 예약을 완료하면 Supabase 대시보드의 Table Editor에서 데이터가 정상적으로 저장되었는지 확인할 수 있습니다.
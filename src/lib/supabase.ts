import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 디버깅을 위한 환경 변수 확인
console.log('Supabase 환경 변수 확인:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : '설정되지 않음',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '설정되지 않음'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!', {
    NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id?: string;
  reserver_name: string;
  phone_number: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
  selected_time_slots: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('BookingList')
    .insert([booking])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('BookingList')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getBookingById(id: string) {
  const { data, error } = await supabase
    .from('BookingList')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  try {
    // Supabase 연결 확인
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase 설정이 올바르지 않습니다. 환경 변수를 확인해주세요.');
    }

    console.log('Updating booking status:', { id, status });
    
    const { data, error } = await supabase
      .from('BookingList')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`예약 상태 업데이트 실패: ${error.message}`);
    }

    if (!data) {
      throw new Error('해당 예약을 찾을 수 없습니다.');
    }

    console.log('Booking status updated successfully:', data);
    return data;
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
}

// 특정 날짜의 예약된 시간 슬롯들을 조회
export async function getBookedTimeSlots(date: string) {
  const { data, error } = await supabase
    .from('BookingList')
    .select('start_time, end_time, selected_time_slots')
    .eq('booking_date', date)
    .eq('status', 'confirmed');

  if (error) {
    throw error;
  }

  return data || [];
}

// 특정 시간 슬롯이 예약 가능한지 확인
export async function isTimeSlotAvailable(date: string, startTime: string, endTime: string) {
  const { data, error } = await supabase
    .from('BookingList')
    .select('id')
    .eq('booking_date', date)
    .eq('status', 'confirmed')
    .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

  if (error) {
    throw error;
  }

  return (data || []).length === 0;
}

// 여러 시간 슬롯들이 모두 예약 가능한지 확인
export async function areTimeSlotsAvailable(date: string, timeSlots: Array<{startTime: string, endTime: string}>) {
  for (const slot of timeSlots) {
    const available = await isTimeSlotAvailable(date, slot.startTime, slot.endTime);
    if (!available) {
      return false;
    }
  }
  return true;
}
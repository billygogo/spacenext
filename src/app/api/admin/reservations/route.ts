import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking, areTimeSlotsAvailable, type Booking } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 관리자용 모든 예약 데이터 조회 시작');
    
    // URL 파라미터에서 날짜 범위 또는 필터 조건 추출
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    
    console.log('📅 조회 조건:', { startDate, endDate, status });
    
    // 모든 예약 데이터 조회
    const bookings = await getBookings();
    
    let filteredBookings = bookings;
    
    // 날짜 범위 필터링
    if (startDate && endDate) {
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return bookingDate >= start && bookingDate <= end;
      });
    }
    
    // 상태 필터링
    if (status && status !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    console.log('✅ 관리자용 예약 데이터 조회 완료:', {
      totalCount: bookings.length,
      filteredCount: filteredBookings.length
    });
    
    return NextResponse.json({
      success: true,
      data: filteredBookings,
      total: bookings.length,
      filtered: filteredBookings.length
    });
    
  } catch (error) {
    console.error('❌ 관리자용 예약 조회 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '예약 데이터 조회에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// 관리자용 수동 예약 생성
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 관리자용 수동 예약 생성 시작');
    
    const bookingData = await request.json();
    
    // 필수 필드 검증
    const requiredFields = ['reserver_name', 'phone_number', 'booking_date', 'start_time', 'end_time', 'total_hours', 'total_price'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { success: false, error: `필수 필드가 누락되었습니다: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // 시간 슬롯 가용성 확인
    const timeSlotsForValidation = [{
      startTime: bookingData.start_time,
      endTime: bookingData.end_time
    }];
    
    const isAvailable = await areTimeSlotsAvailable(
      bookingData.booking_date,
      timeSlotsForValidation
    );
    
    if (!isAvailable) {
      return NextResponse.json(
        { success: false, error: '선택한 시간에 이미 예약이 있습니다.' },
        { status: 409 }
      );
    }
    
    // 기본값 설정
    const newBooking = {
      ...bookingData,
      status: bookingData.status || 'confirmed',
      selected_time_slots: bookingData.selected_time_slots || [`${bookingData.start_time}-${bookingData.end_time}`]
    };
    
    const result = await createBooking(newBooking);
    
    console.log('✅ 관리자용 수동 예약 생성 완료:', result.id);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: '예약이 성공적으로 생성되었습니다.'
    });
    
  } catch (error) {
    console.error('❌ 관리자용 수동 예약 생성 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '예약 생성에 실패했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 
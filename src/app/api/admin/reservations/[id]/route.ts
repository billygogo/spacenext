import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 특정 예약 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const { data: booking, error } = await supabase
      .from('BookingList')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('예약 조회 오류:', error);
      return NextResponse.json(
        { success: false, error: '예약을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('예약 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '예약 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 예약 정보 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const updateData = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // 허용된 필드만 업데이트
    const allowedFields = ['reserver_name', 'phone_number', 'email', 'status'];
    const filteredData: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // 업데이트할 데이터가 없으면 에러
    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // updated_at 필드 추가
    filteredData.updated_at = new Date().toISOString();

    const { data: updatedBooking, error } = await supabase
      .from('BookingList')
      .update(filteredData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('예약 수정 오류:', error);
      return NextResponse.json(
        { success: false, error: '예약 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('✅ 예약 수정 완료:', { bookingId, updatedFields: Object.keys(filteredData) });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: '예약이 성공적으로 수정되었습니다.'
    });

  } catch (error) {
    console.error('예약 수정 실패:', error);
    return NextResponse.json(
      { success: false, error: '예약 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 예약 삭제 (관리자용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('BookingList')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('예약 삭제 오류:', error);
      return NextResponse.json(
        { success: false, error: '예약 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('✅ 예약 삭제 완료:', bookingId);

    return NextResponse.json({
      success: true,
      message: '예약이 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('예약 삭제 실패:', error);
    return NextResponse.json(
      { success: false, error: '예약 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
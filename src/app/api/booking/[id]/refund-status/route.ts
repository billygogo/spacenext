import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get booking information
    const { data: booking, error: bookingError } = await supabase
      .from('BookingList')
      .select(`
        id,
        status,
        booking_date,
        start_time,
        total_price
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Calculate cancellation eligibility
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let canCancel = false;
    
    if (booking.status !== 'cancelled') {
      canCancel = hoursUntilBooking >= 2; // Allow cancellation 2 hours before
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        total_price: booking.total_price,
      },
      cancellation_info: {
        can_cancel: canCancel,
        hours_until_booking: Math.round(hoursUntilBooking * 10) / 10,
        minimum_hours_required: 2,
      },
    });

  } catch (error) {
    console.error('Error getting booking status:', error);
    return NextResponse.json(
      { error: 'Failed to get booking status' },
      { status: 500 }
    );
  }
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
  const { data, error } = await supabase
    .from('BookingList')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
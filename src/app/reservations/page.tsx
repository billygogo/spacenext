'use client';

import { useState, useEffect } from 'react';
import { getBookings, type Booking } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import { CalendarDays, Clock, User, Phone, Search, Calendar, MapPin } from 'lucide-react';

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => 
        booking.reserver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone_number.includes(searchTerm)
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getBookings();
      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('예약 데이터 로드 실패:', err);
      setError('예약 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">확정</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">대기중</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">취소됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM 형식으로 변환
  };

  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">예약 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={loadBookings} variant="outline">
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            예약 현황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            전체 예약 내역을 확인하고 관리하세요
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="예약자명 또는 전화번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">전체 예약</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">확정 예약</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">대기중 예약</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">취소된 예약</div>
            </div>
          </Card>
        </div>

        {/* 예약 목록 */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {searchTerm ? '검색 결과가 없습니다' : '예약 내역이 없습니다'}
                </p>
                <p className="text-sm">
                  {searchTerm ? '다른 검색어로 시도해보세요' : '첫 번째 회의실 예약을 해보세요!'}
                </p>
              </div>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* 예약 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-sm text-gray-500">
                          #{booking.id?.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.reserver_name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">예약자</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.phone_number}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">연락처</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(booking.booking_date)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">예약일</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.total_hours}시간
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 선택된 시간 슬롯 */}
                    {booking.selected_time_slots && booking.selected_time_slots.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">선택된 시간대:</div>
                        <div className="flex flex-wrap gap-2">
                          {booking.selected_time_slots.map((slot, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 가격 정보 */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {booking.total_price?.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(booking.created_at!).toLocaleDateString('ko-KR')} 예약
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
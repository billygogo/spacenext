'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/navigation';
import { CalendarDays, Clock, User, Phone, Search, Settings, Plus, Filter, RefreshCw, Mail } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Booking } from '@/lib/supabase';
import { BookingDetailModal } from '@/components/admin/booking-detail-modal';
import { CreateBookingModal } from '@/components/admin/create-booking-modal';

interface AdminBookingsResponse {
  success: boolean;
  data: Booking[];
  total: number;
  filtered: number;
  error?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  
  // 모달 상태
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, searchTerm, dateRange, selectedDate]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      console.log('📊 관리자 대시보드 - 예약 데이터 로드 시작');
      
      const response = await fetch('/api/admin/reservations');
      const result: AdminBookingsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '데이터 로드 실패');
      }
      
      setBookings(result.data);
      setError(null);
      console.log('✅ 관리자 대시보드 - 예약 데이터 로드 완료:', result.total);
      
    } catch (err) {
      console.error('❌ 관리자 대시보드 - 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // 검색어 필터
    if (searchTerm.trim()) {
      filtered = filtered.filter(booking => 
        booking.reserver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone_number.includes(searchTerm) ||
        (booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 날짜 범위 필터
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(booking => 
          isSameDay(new Date(booking.booking_date), today)
        );
        break;
      case 'week':
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
        });
        break;
      case 'month':
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });
        break;
      case 'all':
        // 모든 데이터 표시
        break;
    }

    setFilteredBookings(filtered);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleBookingUpdate = (updatedBooking: Booking) => {
    // 예약 목록에서 업데이트된 예약 정보 반영
    setBookings(prev => 
      prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
    setSelectedBooking(updatedBooking);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    // 새 예약을 목록에 추가
    setBookings(prev => [newBooking, ...prev]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">예약접수</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">예약확정</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">예약취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 M월 d일 (EEEE)', { locale: ko });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // 선택된 날짜의 예약들
  const selectedDateBookings = bookings.filter(booking => 
    isSameDay(new Date(booking.booking_date), selectedDate)
  );

  // 통계 계산
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    todayBookings: bookings.filter(b => 
      isSameDay(new Date(b.booking_date), new Date())
    ).length
  };

  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">관리자 데이터를 불러오는 중...</p>
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
                <RefreshCw className="w-4 h-4 mr-2" />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  관리자 대시보드
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  예약 현황을 관리하고 모니터링하세요
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={loadBookings} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  새로고침
                </Button>
                <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  수동 예약 추가
                </Button>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">전체 예약</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">예약확정</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">예약접수</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">예약취소</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.todayBookings}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">오늘 예약</div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 달력 */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  예약 달력
                </h3>
                <Calendar
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="mx-auto"
                />
                
                {/* 선택된 날짜의 예약 요약 */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">
                    {format(selectedDate, 'M월 d일', { locale: ko })} 예약
                  </h4>
                  {selectedDateBookings.length === 0 ? (
                    <p className="text-sm text-gray-500">예약이 없습니다</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between text-sm">
                          <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                          {getStatusBadge(booking.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* 오른쪽: 예약 목록 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <h3 className="text-lg font-semibold">예약 목록</h3>
                  
                  {/* 필터 및 검색 */}
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="이름, 전화번호, 이메일 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full md:w-64"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="confirmed">예약확정</SelectItem>
                        <SelectItem value="pending">예약접수</SelectItem>
                        <SelectItem value="cancelled">예약취소</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                      <SelectTrigger className="w-full md:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">오늘</SelectItem>
                        <SelectItem value="week">이번 주</SelectItem>
                        <SelectItem value="month">이번 달</SelectItem>
                        <SelectItem value="all">전체</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 예약 목록 */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>조건에 맞는 예약이 없습니다</p>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <Card 
                        key={booking.id} 
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* 예약 정보 */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusBadge(booking.status)}
                              <span className="text-sm text-gray-500">
                                #{booking.id?.substring(0, 8)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{booking.reserver_name}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-600" />
                                <span>{booking.phone_number}</span>
                              </div>
                              
                              {booking.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-purple-600" />
                                  <span className="truncate">{booking.email}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                <span>{formatDate(booking.booking_date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                                <span className="text-gray-400">({booking.total_hours}시간)</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* 가격 및 액션 */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {booking.total_price?.toLocaleString()}원
                              </div>
                              {booking.created_at && (
                                <div className="text-sm text-gray-500">
                                  {format(new Date(booking.created_at), 'M/d HH:mm')}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookingClick(booking);
                                }}
                              >
                                상세보기
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
                
                {filteredBookings.length > 0 && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600 text-center">
                    총 {filteredBookings.length}개의 예약 (전체 {bookings.length}개 중)
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
        
        {/* 예약 상세 모달 */}
        <BookingDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          booking={selectedBooking}
          onBookingUpdate={handleBookingUpdate}
        />
        
        {/* 수동 예약 생성 모달 */}
        <CreateBookingModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onBookingCreated={handleBookingCreated}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
} 
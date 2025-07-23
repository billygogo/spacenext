'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getBookings, updateBookingStatus, type Booking } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import { CalendarDays, Clock, User, Phone, Search, Calendar, MapPin, XCircle, Mail, LogIn } from 'lucide-react';

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    // 로그인한 사용자의 이메일로 예약을 필터링
    let userBookings = bookings;
    if (session?.user?.email) {
      userBookings = bookings.filter(booking => booking.email === session.user.email);
    }
    
    // 검색어로 추가 필터링
    if (searchTerm.trim() === '') {
      setFilteredBookings(userBookings);
    } else {
      const filtered = userBookings.filter(booking => 
        booking.reserver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone_number.includes(searchTerm)
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings, session?.user?.email]);

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

  // 취소 가능 여부 확인
  const canCancel = (booking: Booking) => {
    // 예약접수와 예약확정 상태만 취소 가능 (이미 취소된 예약은 불가)
    if (booking.status !== 'confirmed' && booking.status !== 'pending') return false;
    
    // 예약 시간이 이미 지났는지만 확인 (현재 시간 이후라면 취소 가능)
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    
    return bookingDateTime.getTime() > now.getTime(); // 예약 시간이 현재보다 미래라면 취소 가능
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!canCancel(booking)) {
      alert('예약 시간이 이미 지나 취소할 수 없습니다.');
      return;
    }

    const confirmed = window.confirm(
      `${booking.reserver_name}님의 예약을 취소하시겠습니까?\n\n예약 정보:\n• 날짜: ${formatDate(booking.booking_date)}\n• 시간: ${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}\n• 금액: ${booking.total_price?.toLocaleString()}원\n\n취소된 예약은 되돌릴 수 없습니다.`
    );

    if (!confirmed) return;

    if (!booking.id) {
      alert('예약 ID가 없어 취소할 수 없습니다.');
      return;
    }

    setCancellingId(booking.id);
    try {
      console.log('예약 취소 시작:', booking.id);
      const result = await updateBookingStatus(booking.id, 'cancelled');
      console.log('예약 취소 성공:', result);
      
      // 로컬 상태 업데이트
      const updatedBookings = bookings.map(b => 
        b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
      );
      setBookings(updatedBookings);
      
      alert('예약이 성공적으로 취소되었습니다.');
    } catch (error) {
      console.error('예약 취소 실패 상세:', {
        error,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
        errorStack: error instanceof Error ? error.stack : null,
        bookingId: booking.id
      });
      
      let errorMessage = '예약 취소 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errorMessage += `\n오류 내용: ${error.message}`;
      }
      
      alert(errorMessage + '\n다시 시도해주세요.');
    } finally {
      setCancellingId(null);
    }
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

  // 로그인하지 않은 사용자
  if (!session?.user?.email) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center max-w-md mx-auto">
              <LogIn className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                로그인이 필요합니다
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                나의 예약 내역을 확인하려면 로그인해주세요.
              </p>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                홈으로 가서 로그인하기
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
            나의 예약 내역
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {session.user.email} 계정의 예약 내역입니다
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
              <div className="text-2xl font-bold text-gray-600">
                {filteredBookings.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">나의 예약</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">예약접수</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredBookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">예약확정</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredBookings.filter(b => b.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">예약취소</div>
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
                  {searchTerm ? '검색 결과가 없습니다' : '아직 예약 내역이 없습니다'}
                </p>
                <p className="text-sm mb-4">
                  {searchTerm ? '다른 검색어로 시도해보세요' : '첫 번째 회의실 예약을 해보세요!'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="mt-2"
                  >
                    지금 예약하기
                  </Button>
                )}
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
                      
                      {booking.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.email}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">이메일</div>
                          </div>
                        </div>
                      )}
                      
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

                  </div>
                  
                  {/* 가격 정보 및 액션 버튼 */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {booking.total_price?.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(booking.created_at!).toLocaleDateString('ko-KR')} 예약
                      </div>
                    </div>
                    
                    {/* 취소 버튼 */}
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                      <div className="flex flex-col gap-2">
                        {canCancel(booking) ? (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                            disabled={cancellingId === booking.id}
                            className="min-w-[100px]"
                          >
                            {cancellingId === booking.id ? (
                              '취소 중...'
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                예약 취소
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="text-center">
                            <Button variant="outline" size="sm" disabled className="min-w-[100px]">
                              취소 불가
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">
                              이용 시간 지남
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {booking.status === 'cancelled' && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        예약취소
                      </Badge>
                    )}
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
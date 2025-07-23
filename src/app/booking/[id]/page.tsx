'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookingById, updateBookingStatus, type Booking } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/navigation';
import { 
  CalendarDays, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadBookingDetails(params.id as string);
    }
  }, [params.id]);

  const loadBookingDetails = async (bookingId: string) => {
    try {
      setIsLoading(true);
      const data = await getBookingById(bookingId);
      setBooking(data);
      setError(null);
    } catch (err) {
      console.error('예약 정보 로드 실패:', err);
      setError('예약 정보를 찾을 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 가능 여부 확인 (24시간 전까지)
  const canCancel = () => {
    if (!booking || booking.status !== 'confirmed') return false;
    
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const now = new Date();
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff > 24; // 24시간 이상 남은 경우만 취소 가능
  };

  const handleCancelBooking = async () => {
    if (!booking || !canCancel()) return;

    const confirmed = window.confirm(
      '정말로 예약을 취소하시겠습니까?\n취소된 예약은 되돌릴 수 없습니다.'
    );

    if (!confirmed) return;

    setIsCancelling(true);
    try {
      await updateBookingStatus(booking.id!, 'cancelled');
      setBooking({ ...booking, status: 'cancelled' });
      alert('예약이 성공적으로 취소되었습니다.');
    } catch (error) {
      console.error('예약 취소 실패:', error);
      alert('예약 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            예약 확정
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            대기중
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            취소됨
          </Badge>
        );
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

  if (error || !booking) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                예약을 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || '요청하신 예약 정보가 존재하지 않습니다.'}
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                홈으로 돌아가기
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              예약 확인
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              예약 정보를 확인하고 필요한 경우 취소할 수 있습니다.
            </p>
          </div>

          {/* 예약 정보 카드 */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* 예약 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  {getStatusBadge(booking.status)}
                  <span className="text-sm text-gray-500">
                    예약 ID: #{booking.id?.substring(0, 8)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.reserver_name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">예약자</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.phone_number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">연락처</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <CalendarDays className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatDate(booking.booking_date)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">예약일</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.total_hours}시간
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        스마트 회의실 A
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">회의실</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.total_price?.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">결제 금액</div>
                    </div>
                  </div>
                </div>
                
                {/* 선택된 시간 슬롯 */}
                {booking.selected_time_slots && booking.selected_time_slots.length > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">선택된 시간대:</div>
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
            </div>
          </Card>

          {/* 취소 정책 및 안내 */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">취소 정책 및 이용 안내</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>예약 취소는 <strong>이용 24시간 전까지만</strong> 가능합니다.</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>취소 시 100% 환불되며, 환불은 3-5 영업일 소요됩니다.</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>예약 후 15분 이내에 입실해주세요.</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>무료 WiFi, 프로젝터, 화이트보드가 제공됩니다.</div>
              </div>
            </div>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
              홈으로 돌아가기
            </Button>
            
            {booking.status === 'confirmed' && canCancel() && (
              <Button 
                variant="destructive" 
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1"
              >
                {isCancelling ? '취소 처리 중...' : '예약 취소하기'}
              </Button>
            )}
            
            {booking.status === 'confirmed' && !canCancel() && (
              <div className="flex-1">
                <Button variant="destructive" disabled className="w-full">
                  취소 불가 (24시간 이내)
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  취소는 이용 24시간 전까지만 가능합니다.
                </p>
              </div>
            )}
            
            {booking.status === 'cancelled' && (
              <div className="flex-1">
                <Button variant="outline" disabled className="w-full">
                  이미 취소된 예약
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
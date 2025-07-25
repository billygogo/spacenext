'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlotSelector } from '@/components/time-slot-selector';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { CalendarDays, Clock, Users, MapPin, CreditCard, User, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBooking, type Booking, areTimeSlotsAvailable, testSupabaseConnection } from '@/lib/supabase';
import axios from 'axios';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [reserverName, setReserverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'date-time' | 'user-info' | 'confirmation'>('date-time');
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
  };

  const handleTimeSlotSelect = (timeSlots: TimeSlot[]) => {
    setSelectedTimeSlots(timeSlots);
  };

  const handleNext = async () => {
    if (step === 'date-time' && selectedDate && selectedTimeSlots.length > 0) {
      setStep('user-info');
    } else if (step === 'user-info' && reserverName.trim() && phoneNumber.trim() && email.trim()) {
      await handleBooking();
    }
  };

  const handleBack = () => {
    if (step === 'user-info') {
      setStep('date-time');
    } else if (step === 'confirmation') {
      setStep('user-info');
    }
  };

  // 웹훅 호출 함수
  const callBookingWebhook = async (bookingData: any, bookingId: string) => {
    try {
      const webhookUrl = 'https://hook.eu1.make.com/cdgx85qc81x89gk68bmq2g8wtbpxv79k';
      
      // 예약 확인 링크 생성
      const bookingLink = `${window.location.origin}/booking/${bookingId}`;
      
      const webhookPayload = {
        event: 'booking_completed',
        timestamp: new Date().toISOString(),
        booking: {
          id: bookingId,
          reserver_name: bookingData.reserver_name,
          phone_number: bookingData.phone_number,
          booking_date: bookingData.booking_date,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          total_hours: bookingData.total_hours,
          total_price: bookingData.total_price,
          selected_time_slots: bookingData.selected_time_slots,
          status: bookingData.status,
          booking_link: bookingLink
        },
        notification: {
          message: `${bookingData.reserver_name}님의 회의실 예약이 완료되었습니다.\n\n예약 확인 및 취소: ${bookingLink}\n\n예약 정보:\n• 날짜: ${bookingData.booking_date}\n• 시간: ${bookingData.start_time} - ${bookingData.end_time}\n• 금액: ${bookingData.total_price.toLocaleString()}원\n\n※ 취소는 이용 24시간 전까지 가능합니다.`,
          phone: bookingData.phone_number,
          booking_link: bookingLink
        }
      };

      await axios.post(webhookUrl, webhookPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      console.log('웹훅 호출 성공:', webhookPayload);
    } catch (error) {
      console.error('웹훅 호출 실패:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || selectedTimeSlots.length === 0 || !reserverName.trim() || !phoneNumber.trim() || !email.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 예약 생성 프로세스 시작
      console.log('🚀 예약 생성 프로세스 시작');
      const sortedSlots = [...selectedTimeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
      const startTime = sortedSlots[0].startTime;
      const endTime = sortedSlots[sortedSlots.length - 1].endTime;
      
      // 예약 생성 전 재검증
      const dateString = selectedDate.toISOString().split('T')[0];
      const timeSlotsForValidation = selectedTimeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
      
      console.log('🔍 시간 슬롯 가용성 확인 중...', { dateString, timeSlotsForValidation });
      const stillAvailable = await areTimeSlotsAvailable(dateString, timeSlotsForValidation);
      
      if (!stillAvailable) {
        alert('선택한 시간에 다른 예약이 생성되었습니다. 시간을 다시 선택해주세요.');
        setStep('date-time');
        setSelectedTimeSlots([]);
        return;
      }
      
      const bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
        reserver_name: reserverName.trim(),
        phone_number: phoneNumber.trim(),
        email: email.trim(),
        booking_date: dateString,
        start_time: startTime,
        end_time: endTime,
        total_hours: totalHours,
        total_price: finalPrice,
        selected_time_slots: selectedTimeSlots.map(slot => `${slot.startTime}-${slot.endTime}`),
        status: 'confirmed'
      };

      console.log('📝 예약 데이터 생성:', bookingData);
      console.log('🚀 Supabase에 예약 저장 시도 중...');
      
      const result = await createBooking(bookingData);
      
      console.log('✅ 예약 성공! DB 저장된 데이터:', result);
      
      // 예약 성공 후 웹훅 호출
      console.log('📢 웹훅 호출 시작...');
      await callBookingWebhook(bookingData, result.id);
      console.log('📢 웹훅 호출 완료');
      
      // 성공 시 확인 단계로 이동
      setStep('confirmation');
      
    } catch (error) {
      console.error('❌ 예약 실패 - 상세 에러:', error);
      
      // 더 자세한 에러 정보 로깅
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
        
        if (error.message.includes('duplicate') || error.message.includes('conflict') || error.message.includes('예약이 있습니다')) {
          alert('선택한 시간에 이미 예약이 있습니다. 다른 시간을 선택해주세요.');
          setStep('date-time');
          setSelectedTimeSlots([]);
        } else {
          alert(`예약 중 오류가 발생했습니다: ${error.message}\n\n개발자 도구 콘솔을 확인해주세요.`);
        }
      } else {
        console.error('알 수 없는 에러 타입:', typeof error, error);
        alert('예약 중 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = (() => {
    if (step === 'date-time') {
      return selectedDate && selectedTimeSlots.length > 0;
    } else if (step === 'user-info') {
      return reserverName.trim() && phoneNumber.trim() && email.trim();
    }
    return true;
  })();

  const totalHours = selectedTimeSlots.length;
  const pricePerHour = 10000;
  const totalPrice = totalHours * pricePerHour;
  const tax = Math.floor(totalPrice * 0.1);
  const finalPrice = totalPrice + tax;

  const getTimeRange = () => {
    if (selectedTimeSlots.length === 0) return '';
    
    const sortedSlots = [...selectedTimeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    
    return `${firstSlot.startTime} - ${lastSlot.endTime}`;
  };

  const resetForm = () => {
    setStep('date-time');
    setSelectedDate(undefined);
    setSelectedTimeSlots([]);
    setReserverName('');
    setPhoneNumber('');
    setEmail('');
  };

  const handleClose = () => {
    onOpenChange(false);
    // 약간의 지연 후 상태 초기화 (모달 닫힘 애니메이션 완료 후)
    setTimeout(() => {
      resetForm();
    }, 200);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[900px] w-full h-full overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">회의실 예약하기</SheetTitle>
          <SheetDescription>
            {step === 'date-time' 
              ? '날짜와 시간을 선택하여 회의실을 예약하세요'
              : step === 'user-info'
                ? '예약자 정보를 입력해주세요'
                : '예약이 완료되었습니다'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          {step === 'date-time' && (
            <div className="space-y-6">
              {/* 날짜 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  예약 날짜 선택
                </h3>
                <Calendar
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="mx-auto"
                />
              </div>

              <Separator />

              {/* 시간 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  예약 시간 선택
                </h3>
                <TimeSlotSelector
                  selectedDate={selectedDate}
                  selectedTimeSlots={selectedTimeSlots}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </div>
            </div>
          )}

          {step === 'user-info' && (
            <div className="space-y-6">
              {/* 예약자 정보 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  예약자 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reserverName">예약자 이름 *</Label>
                    <Input
                      id="reserverName"
                      type="text"
                      placeholder="이름을 입력해주세요"
                      value={reserverName}
                      onChange={(e) => setReserverName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">핸드폰 번호 *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 주소 *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>

              {/* 예약 요약 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">선택한 예약 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    <div className="text-sm">
                      <span className="font-medium">날짜:</span> {selectedDate?.toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div className="text-sm">
                      <span className="font-medium">시간:</span> {getTimeRange()} ({totalHours}시간)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <div className="text-sm">
                      <span className="font-medium">예상 금액:</span> {finalPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="space-y-6">
              {/* 예약 완료 메시지 */}
              <Card className="p-6 text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  예약이 완료되었습니다!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  예약 확인 메시지가 곧 발송됩니다.
                </p>
              </Card>

              {/* 예약 정보 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">예약 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">예약 날짜</div>
                      <div className="text-sm text-gray-600">
                        {selectedDate?.toLocaleDateString('ko-KR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">예약 시간</div>
                      <div className="text-sm text-gray-600">
                        {getTimeRange()} ({totalHours}시간)
                      </div>
                      {selectedTimeSlots.length > 1 && (
                        <div className="text-xs text-blue-600 mt-1">
                          선택된 시간: {selectedTimeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">회의실</div>
                      <div className="text-sm text-gray-600">스마트 회의실 A (최대 8명)</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">예약자</div>
                      <div className="text-sm text-gray-600">{reserverName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">연락처</div>
                      <div className="text-sm text-gray-600">{phoneNumber}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">이메일</div>
                      <div className="text-sm text-gray-600">{email}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 결제 정보 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  결제 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>회의실 이용료 ({totalHours}시간)</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>부가세</span>
                    <span>{tax.toLocaleString()}원</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>총 결제금액</span>
                    <span className="text-blue-600">{finalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </Card>

              {/* 이용 안내 */}
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  이용 안내사항
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>• 예약 후 15분 이내에 입실해주세요</li>
                  <li>• 회의실 연장은 현장에서 가능합니다</li>
                  <li>• 무료 WiFi, 프로젝터, 화이트보드 제공</li>
                  <li>• 취소는 이용 2시간 전까지 가능합니다</li>
                </ul>
              </Card>
            </div>
          )}
        </div>

        <SheetFooter className="flex gap-3">
          {step !== 'date-time' && step !== 'confirmation' && (
            <Button variant="outline" onClick={handleBack}>
              이전으로
            </Button>
          )}
          {step !== 'confirmation' && (
            <Button
              onClick={handleNext}
              disabled={!canProceed || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                '처리 중...'
              ) : step === 'date-time' ? (
                canProceed ? '다음 단계' : '날짜와 시간을 선택하세요'
              ) : step === 'user-info' ? (
                canProceed ? '예약하기' : '예약자 정보를 입력하세요'
              ) : (
                '다음 단계'
              )}
            </Button>
          )}
          {step === 'confirmation' && (
            <Button
              onClick={handleClose}
              className="flex-1"
            >
              확인
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
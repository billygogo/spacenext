'use client';

import { useState } from 'react';
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
import { CalendarDays, Clock, Users, MapPin, CreditCard } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [step, setStep] = useState<'date-time' | 'confirmation'>('date-time');

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
  };

  const handleTimeSlotSelect = (timeSlots: TimeSlot[]) => {
    setSelectedTimeSlots(timeSlots);
  };

  const handleNext = () => {
    if (selectedDate && selectedTimeSlots.length > 0) {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    setStep('date-time');
  };

  const handleBooking = () => {
    console.log('예약 요청:', {
      date: selectedDate,
      timeSlots: selectedTimeSlots,
    });
    onOpenChange(false);
    setStep('date-time');
    setSelectedDate(undefined);
    setSelectedTimeSlots([]);
  };

  const canProceed = selectedDate && selectedTimeSlots.length > 0;

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[900px] w-full h-full overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">회의실 예약하기</SheetTitle>
          <SheetDescription>
            {step === 'date-time' 
              ? '날짜와 시간을 선택하여 회의실을 예약하세요'
              : '예약 정보를 확인하고 결제를 진행하세요'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          {step === 'date-time' ? (
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
          ) : (
            <div className="space-y-6">
              {/* 예약 요약 */}
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
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">이용 인원</div>
                      <div className="text-sm text-gray-600">4명 (변경 가능)</div>
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
          {step === 'confirmation' && (
            <Button variant="outline" onClick={handleBack}>
              이전으로
            </Button>
          )}
          <Button
            onClick={step === 'date-time' ? handleNext : handleBooking}
            disabled={step === 'date-time' && !canProceed}
            className="flex-1"
          >
            {step === 'date-time' 
              ? (canProceed ? '다음 단계' : '날짜와 시간을 선택하세요')
              : '결제하고 예약 완료'
            }
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, User, Phone, Mail, Plus, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Booking } from '@/lib/supabase';

interface CreateBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingCreated: (newBooking: Booking) => void;
  selectedDate?: Date;
}

interface BookingFormData {
  reserver_name: string;
  phone_number: string;
  email: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export function CreateBookingModal({ 
  open, 
  onOpenChange, 
  onBookingCreated,
  selectedDate 
}: CreateBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    reserver_name: '',
    phone_number: '',
    email: '',
    booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    total_hours: 1,
    total_price: 11000, // 1시간 + 10% 세금
    status: 'confirmed'
  });

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // 시간이 변경되면 자동으로 총 시간과 가격 계산
      if (field === 'start_time' || field === 'end_time') {
        const startTime = field === 'start_time' ? value as string : prev.start_time;
        const endTime = field === 'end_time' ? value as string : prev.end_time;
        
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        
        if (end > start) {
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          const basePrice = hours * 10000;
          const totalPrice = Math.round(basePrice * 1.1); // 10% 세금 포함
          
          updated.total_hours = hours;
          updated.total_price = totalPrice;
        }
      }
      
      return updated;
    });
  };

  const validateForm = () => {
    const { reserver_name, phone_number, booking_date, start_time, end_time } = formData;
    
    if (!reserver_name.trim()) {
      alert('예약자 이름을 입력해주세요.');
      return false;
    }
    
    if (!phone_number.trim()) {
      alert('연락처를 입력해주세요.');
      return false;
    }
    
    if (!booking_date) {
      alert('예약 날짜를 선택해주세요.');
      return false;
    }
    
    const start = new Date(`2000-01-01T${start_time}:00`);
    const end = new Date(`2000-01-01T${end_time}:00`);
    
    if (end <= start) {
      alert('종료 시간은 시작 시간보다 나중이어야 합니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '예약 생성에 실패했습니다.');
      }

      onBookingCreated(result.data);
      onOpenChange(false);
      
      // 폼 초기화
      setFormData({
        reserver_name: '',
        phone_number: '',
        email: '',
        booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        start_time: '09:00',
        end_time: '10:00',
        total_hours: 1,
        total_price: 11000,
        status: 'confirmed'
      });
      
    } catch (error) {
      console.error('예약 생성 오류:', error);
      alert(error instanceof Error ? error.message : '예약 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      reserver_name: '',
      phone_number: '',
      email: '',
      booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
      total_hours: 1,
      total_price: 11000,
      status: 'confirmed'
    });
    onOpenChange(false);
  };

  // 시간 옵션 생성 (30분 단위)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            수동 예약 추가
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 예약자 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                예약자 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reserver_name">예약자 이름 *</Label>
                  <Input
                    id="reserver_name"
                    value={formData.reserver_name}
                    onChange={(e) => handleInputChange('reserver_name', e.target.value)}
                    placeholder="이름을 입력해주세요"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone_number">연락처 *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    placeholder="010-1234-5678"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예약 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                예약 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="booking_date">예약 날짜 *</Label>
                  <Input
                    id="booking_date"
                    type="date"
                    value={formData.booking_date}
                    onChange={(e) => handleInputChange('booking_date', e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="start_time">시작 시간 *</Label>
                    <Select 
                      value={formData.start_time} 
                      onValueChange={(value) => handleInputChange('start_time', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="end_time">종료 시간 *</Label>
                    <Select 
                      value={formData.end_time} 
                      onValueChange={(value) => handleInputChange('end_time', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>이용 시간</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                      {formData.total_hours}시간
                    </div>
                  </div>
                  
                  <div>
                    <Label>결제 금액</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm font-medium text-blue-600">
                      {formData.total_price.toLocaleString()}원
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status">예약 상태</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">예약접수</SelectItem>
                      <SelectItem value="confirmed">예약확정</SelectItem>
                      <SelectItem value="cancelled">예약취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? '생성 중...' : '예약 생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
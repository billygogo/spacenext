'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, User, Phone, Mail, MapPin, CreditCard, Save, X, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Booking } from '@/lib/supabase';

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onBookingUpdate: (updatedBooking: Booking) => void;
}

export function BookingDetailModal({ 
  open, 
  onOpenChange, 
  booking, 
  onBookingUpdate 
}: BookingDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<Partial<Booking>>({});

  useEffect(() => {
    if (booking) {
      setEditData({
        reserver_name: booking.reserver_name,
        phone_number: booking.phone_number,
        email: booking.email,
        status: booking.status,
      });
    }
  }, [booking]);

  if (!booking) return null;

  const handleSave = async () => {
    if (!booking.id) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/reservations/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('예약 수정에 실패했습니다.');
      }

      const result = await response.json();
      if (result.success) {
        onBookingUpdate(result.data);
        setIsEditing(false);
      } else {
        throw new Error(result.error || '예약 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 수정 오류:', error);
      alert(error instanceof Error ? error.message : '예약 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      reserver_name: booking.reserver_name,
      phone_number: booking.phone_number,
      email: booking.email,
      status: booking.status,
    });
    setIsEditing(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>예약 상세 정보</span>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              <span className="text-sm text-gray-500">
                #{booking.id?.substring(0, 8)}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 예약 기본 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                예약 정보
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">예약 날짜</Label>
                  <div className="font-medium">{formatDate(booking.booking_date)}</div>
                </div>
                <div>
                  <Label className="text-gray-600">예약 시간</Label>
                  <div className="font-medium">
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    <span className="text-gray-500 ml-2">({booking.total_hours}시간)</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">이용 금액</Label>
                  <div className="font-bold text-blue-600 text-lg">
                    {booking.total_price?.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">등록일시</Label>
                  <div className="font-medium">
                    {booking.created_at && format(new Date(booking.created_at), 'yyyy.MM.dd HH:mm')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예약자 정보 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                예약자 정보
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reserver_name">예약자 이름</Label>
                  {isEditing ? (
                    <Input
                      id="reserver_name"
                      value={editData.reserver_name || ''}
                      onChange={(e) => setEditData({ ...editData, reserver_name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 font-medium">{booking.reserver_name}</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone_number">연락처</Label>
                  {isEditing ? (
                    <Input
                      id="phone_number"
                      value={editData.phone_number || ''}
                      onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 font-medium">{booking.phone_number}</div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">이메일</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 font-medium">{booking.email || '없음'}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예약 상태 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                예약 상태
              </h3>
              <div>
                <Label htmlFor="status">상태</Label>
                {isEditing ? (
                  <Select 
                    value={editData.status || booking.status} 
                    onValueChange={(value) => setEditData({ ...editData, status: value as Booking['status'] })}
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
                ) : (
                  <div className="mt-1">
                    {getStatusBadge(booking.status)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 선택된 시간 슬롯 */}
          {booking.selected_time_slots && booking.selected_time_slots.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  선택된 시간 슬롯
                </h3>
                <div className="flex flex-wrap gap-2">
                  {booking.selected_time_slots.map((slot, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {slot}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? '저장 중...' : '저장'}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
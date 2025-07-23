'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  selectedDate?: Date;
  selectedTimeSlots?: TimeSlot[];
  onTimeSlotSelect?: (timeSlots: TimeSlot[]) => void;
  className?: string;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = 9; hour < 22; hour += 1) {
    const startHour = hour.toString().padStart(2, '0');
    const endHour = (hour + 1).toString().padStart(2, '0');
    
    slots.push({
      id: `${startHour}:00-${endHour}:00`,
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
      available: Math.random() > 0.3
    });
  }
  
  return slots;
};

export function TimeSlotSelector({ 
  selectedDate, 
  selectedTimeSlots = [], 
  onTimeSlotSelect,
  className = '' 
}: TimeSlotSelectorProps) {
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    
    const isSelected = selectedTimeSlots.some(s => s.id === slot.id);
    let newSelectedSlots: TimeSlot[];
    
    if (isSelected) {
      // Remove slot if already selected
      newSelectedSlots = selectedTimeSlots.filter(s => s.id !== slot.id);
    } else {
      // Add slot to selection
      newSelectedSlots = [...selectedTimeSlots, slot];
    }
    
    onTimeSlotSelect?.(newSelectedSlots);
  };

  if (!selectedDate) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">날짜를 먼저 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          예약 시간 선택
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {timeSlots.map((slot) => {
          const isSelected = selectedTimeSlots.some(s => s.id === slot.id);
          return (
            <Button
              key={slot.id}
              variant={isSelected ? "default" : "outline"}
              disabled={!slot.available}
              onClick={() => handleTimeSlotClick(slot)}
              className={`
                h-16 flex flex-col items-center justify-center p-3 text-sm
                ${!slot.available 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' 
                  : isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900'
                }
              `}
            >
              <div className="font-medium">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className="text-xs opacity-75">
                {slot.available ? (isSelected ? '선택됨' : '예약가능') : '예약불가'}
              </div>
            </Button>
          );
        })}
      </div>

      {timeSlots.filter(slot => slot.available).length === 0 && (
        <div className="text-center mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            선택한 날짜에 예약 가능한 시간이 없습니다.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          예약 안내
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• 모든 예약은 1시간 단위로 진행됩니다</li>
          <li>• 여러 시간대를 선택하여 연속 예약 가능합니다</li>
          <li>• 예약 후 15분 이내 입실해주세요</li>
          <li>• 회의실 연장은 현장에서 가능합니다</li>
        </ul>
      </div>
    </div>
  );
}
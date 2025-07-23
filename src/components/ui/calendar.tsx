'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export function Calendar({ selected, onSelect, minDate = new Date(), className = '' }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = 'yyyy년 M월';
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;
      const isDisabled = day < minDate;
      const isSelected = selected && isSameDay(day, selected);
      const isCurrentMonth = isSameMonth(day, monthStart);
      
      days.push(
        <div
          key={day.toString()}
          className={`
            p-2 text-center cursor-pointer text-sm h-10 flex items-center justify-center
            ${!isCurrentMonth 
              ? 'text-gray-300 dark:text-gray-600' 
              : isDisabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900'
            }
            ${isSelected ? 'bg-blue-600 text-white rounded-md' : ''}
          `}
          onClick={() => {
            if (!isDisabled && isCurrentMonth && onSelect) {
              onSelect(cloneDay);
            }
          }}
        >
          <span>{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(currentMonth, dateFormat, { locale: ko })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="space-y-1">{rows}</div>
    </div>
  );
}
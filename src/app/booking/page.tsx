'use client';

import { BookingModal } from '@/components/booking-modal';
import { useState } from 'react';

export default function BookingPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          회의실 예약
        </h1>
        
        <BookingModal 
          open={bookingModalOpen} 
          onOpenChange={(open) => {
            setBookingModalOpen(open);
            if (!open) {
              // Navigate back to home when modal closes
              window.history.back();
            }
          }} 
        />
      </div>
    </div>
  );
}
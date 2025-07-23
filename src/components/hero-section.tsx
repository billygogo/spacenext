'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { BookingModal } from '@/components/booking-modal';

const backgroundImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-70' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            스마트한 회의실 예약
            <br />
            <span className="text-blue-400">space.NEXT</span>
          </h1>
          
          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            90% 자동화된 회의실 예약 시스템으로 간편하고 빠르게 
            <br />
            비접촉 출입과 결제까지 한 번에
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">실시간 예약</h3>
              <p className="text-sm text-gray-600">언제든지 빠른 예약</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">비접촉 출입</h3>
              <p className="text-sm text-gray-600">스마트 도어 시스템</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">자동화 관리</h3>
              <p className="text-sm text-gray-600">90% 자동화 시스템</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">팀 협업</h3>
              <p className="text-sm text-gray-600">효율적인 공간 활용</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => router.push('/booking')}
            >
              회의실 예약하기
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              서비스 둘러보기
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">90%</div>
              <div className="text-gray-200">자동화율</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-200">서비스 운영</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">2초</div>
              <div className="text-gray-200">평균 예약 시간</div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        open={bookingModalOpen} 
        onOpenChange={setBookingModalOpen} 
      />
    </section>
  );
}
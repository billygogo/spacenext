'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { BookingModal } from '@/components/booking-modal';
import { motion, AnimatePresence } from 'framer-motion';

const backgroundImages = [
  {
    url: '/images/service/fdfd1e34-ae5f-40b4-83eb-b6a9af9e2664.png',
    title: '프리미엄 컨퍼런스룸',
    description: '대규모 회의와 프레젠테이션을 위한 최고급 시설'
  },
  {
    url: '/images/service/f1985964-ec7a-4f04-9247-11a004d145bb.png',
    title: '모던 브레인스토밍 공간',
    description: '창의적 아이디어가 흘러나오는 혁신적인 협업 공간'
  },
  {
    url: '/images/service/c1c4ab36-bbba-4392-9278-4acf1b2c02d1.png',
    title: '스마트 미팅룸',
    description: '최신 IT 장비를 갖춘 효율적인 업무 공간'
  }
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 12000); // 12초마다 변경 (매우 느리게)

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const currentImage = backgroundImages[currentImageIndex];

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Background Images with Smooth Slide Transitions - Full Width */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ 
              duration: 1.2, 
              ease: [0.4, 0.0, 0.2, 1],
              type: "tween"
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentImage.url})` }}
          />
        </AnimatePresence>
      </div>
      
      {/* Gradient Overlay - Dark on left, completely clear on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/20 to-transparent" />
      
      {/* Left Section - Text Content */}
      <div className="relative w-full lg:w-1/2 flex items-center z-10">
        
        {/* Text Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 py-16">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Current Image Info - Hidden */}
            {/* <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <div className="inline-flex items-center bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium border border-white/40">
                <MapPin className="w-4 h-4 mr-2" />
                {currentImage.title} - {currentImage.description}
              </div>
            </motion.div> */}

            {/* Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ textShadow: '2px 4px 8px rgba(0, 0, 0, 0.8)' }}
            >
              <span className="text-blue-300 drop-shadow-lg">space.NEXT</span>
            </motion.h1>
            
            {/* Hero Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl text-white font-light leading-relaxed drop-shadow-lg">
                지금의 나를 넘어,
              </p>
              <p className="text-2xl md:text-3xl font-light leading-relaxed mt-2">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent font-medium drop-shadow-xl">
                  다음을 향해 나아가는 공간
                </span>
              </p>
            </motion.div>
            
            {/* Hero Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-100 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/25"
              style={{ textShadow: '1px 2px 4px rgba(0, 0, 0, 0.7)' }}
            >
              혁신적인 회의실 예약 시스템으로 더 나은 업무 환경을 만들어보세요
            </motion.p>

            


            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setBookingModalOpen(true)}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  회의실 예약하기
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-3 text-lg bg-black/40 backdrop-blur-md border-white/60 text-white hover:bg-black/60 transition-all duration-300 drop-shadow-lg"
                  onClick={() => router.push('/service')}
                >
                  서비스 둘러보기
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4"
            >
              {[
                { value: '90%', label: '자동화율', color: 'blue' },
                { value: '24/7', label: '서비스 운영', color: 'blue' },
                { value: '2초', label: '평균 예약 시간', color: 'blue' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center lg:text-left bg-black/40 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-white/30"
                >
                  <div className={`text-2xl lg:text-3xl xl:text-4xl font-bold text-${stat.color}-300 mb-1 lg:mb-2 drop-shadow-lg`}>
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-white font-medium drop-shadow">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Section - Controls Area */}
      <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex items-center justify-center z-10">
      </div>
      
      {/* Image Navigation Controls - Positioned for entire section */}
      <div className="absolute top-1/2 left-4 lg:left-1/2 transform -translate-y-1/2 lg:translate-x-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevImage}
          className="bg-black/40 hover:bg-black/60 text-white border-white/40 backdrop-blur-md shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={nextImage}
          className="bg-black/40 hover:bg-black/60 text-white border-white/40 backdrop-blur-md shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Auto-play Control */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAutoPlay}
          className="bg-black/40 hover:bg-black/60 text-white border-white/40 backdrop-blur-md shadow-lg"
        >
          {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 lg:left-3/4 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
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
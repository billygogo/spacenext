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
  },
  {
    url: '/images/service/b53e7f3f-4592-4dbe-a485-e30a2181a064.png',
    title: '라운지형 회의실',
    description: '편안한 분위기에서 진행하는 캐주얼 미팅'
  },
  {
    url: '/images/service/ae56948f-9aa5-43ac-9fd9-5c01d11e1d7d.png',
    title: '유리벽 회의실',
    description: '개방감과 프라이버시를 동시에 제공하는 공간'
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
    }, 6000);

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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with Smooth Transitions */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentImage.url})` }}
          />
        </AnimatePresence>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
      
      {/* Image Navigation Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevImage}
          className="bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={nextImage}
          className="bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm"
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
          className="bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm"
        >
          {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
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
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Current Image Info */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                {currentImage.title} - {currentImage.description}
              </div>
            </motion.div>

                        {/* Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
            >
              <span className="text-blue-400">space.NEXT</span>
            </motion.h1>
            
            {/* Hero Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                지금의 나를 넘어,
              </p>
              <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed mt-2">
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-medium">
                  다음을 향해 나아가는 공간
                </span>
              </p>
            </motion.div>
            
            {/* Hero Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              혁신적인 회의실 예약 시스템으로 더 나은 업무 환경을 만들어보세요
            </motion.p>

            

            {/* Feature Cards
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
            >
              {[
                { icon: Calendar, title: '실시간 예약', desc: '언제든지 빠른 예약', color: 'blue' },
                { icon: MapPin, title: '비접촉 출입', desc: '스마트 도어 시스템', color: 'green' },
                { icon: Clock, title: '자동화 관리', desc: '90% 자동화 시스템', color: 'purple' },
                { icon: Users, title: '팀 협업', desc: '효율적인 공간 활용', color: 'orange' }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Icon className={`w-8 h-8 text-${feature.color}-600 mx-auto mb-3`} />
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div> */}

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
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
                  className="px-8 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
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
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { value: '90%', label: '자동화율', color: 'blue' },
                { value: '24/7', label: '서비스 운영', color: 'green' },
                { value: '2초', label: '평균 예약 시간', color: 'purple' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className={`text-4xl md:text-5xl font-bold text-${stat.color}-400 mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-200 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
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
'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Shield, 
  Smartphone, 
  CreditCard, 
  CheckCircle,
  Star,
  Building,
  Wifi,
  Monitor,
  Coffee,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import Image from 'next/image';

// 서비스 데이터
const serviceFeatures = [
  {
    id: 1,
    image: '/images/service/0cef001f-46cf-4ed6-84bf-65688c95940a.png',
    title: '프리미엄 컨퍼런스룸',
    subtitle: '최대 20명 수용 가능한 대형 회의실',
    description: '4K 디스플레이, 기가비트 Wi-Fi, 고급 음향 시설을 갖춘 프리미엄 회의 공간입니다.',
    icon: Building,
    color: 'from-blue-600 to-purple-700'
  },
  {
    id: 2,
    image: '/images/service/0f3c0970-942b-4dfa-99d2-4961c7054ea5.png',
    title: '실시간 예약 시스템',
    subtitle: '언제 어디서나 즉시 예약',
    description: '실시간 예약 현황을 확인하고 몇 번의 클릭만으로 간편하게 예약할 수 있습니다.',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 3,
    image: '/images/service/2243796c-14a7-4519-8d10-9b15445db3b3.png',
    title: '스마트 출입 관리',
    subtitle: '비접촉 보안 시스템',
    description: 'QR코드 또는 모바일 앱으로 안전하고 편리하게 출입할 수 있는 첨단 시스템입니다.',
    icon: Shield,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 4,
    image: '/images/service/3a68c7ff-e96e-4fe9-9039-79d1f87c2c0a.png',
    title: '소형 미팅룸',
    subtitle: '4-8명 소규모 회의',
    description: '아늑하고 집중도 높은 환경에서 효과적인 소규모 회의를 진행할 수 있습니다.',
    icon: Users,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 5,
    image: '/images/service/4f8805aa-12a2-4a68-83f1-3d168b76210d.png',
    title: 'AI 자동화 관리',
    subtitle: '90% 자동화된 시스템',
    description: 'AI 기반 자동화로 관리 효율성을 극대화하고 운영 비용을 절감합니다.',
    icon: Clock,
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 6,
    image: '/images/service/58845920-7b30-4491-b2a5-4ae40df7db47.png',
    title: '모던 회의 공간',
    subtitle: '창의적 사고를 자극하는 혁신적 디자인',
    description: '현대적이고 세련된 인테리어로 창의성과 생산성을 높이는 회의 환경을 제공합니다.',
    icon: Star,
    color: 'from-cyan-500 to-blue-500'
  }
];

export default function ServicePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % serviceFeatures.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % serviceFeatures.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + serviceFeatures.length) % serviceFeatures.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              스마트한 회의실 예약 서비스
              <br />
              <span className="text-blue-600">space.NEXT</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              90% 자동화된 시스템으로 간편하고 빠르게 회의실을 예약하고,
              비접촉 출입부터 결제까지 모든 과정을 디지털로 완성하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                무료 체험 시작하기
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                서비스 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 갤러리 - 그리드 이미지 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              space.NEXT 서비스 갤러리
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              최첨단 기술과 세련된 디자인이 만나 완성된 프리미엄 회의실 공간을 
              직접 확인해보세요.
            </p>
          </div>
          
          {/* 메인 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 대형 카드 1 */}
            <div className="md:col-span-2 md:row-span-2">
              <Card className="group overflow-hidden h-full hover:shadow-2xl transition-all duration-500">
                <div className="relative h-full min-h-[400px]">
                  <Image
                    src="/images/service/0cef001f-46cf-4ed6-84bf-65688c95940a.png"
                    alt="메인 회의실"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-bold mb-3">프리미엄 컨퍼런스룸</h3>
                    <p className="text-lg text-gray-200 mb-4">최대 20명 수용 가능한 대형 회의실</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-5 h-5" />
                        <span className="text-sm">4K 디스플레이</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-5 h-5" />
                        <span className="text-sm">기가비트 Wi-Fi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 일반 카드들 */}
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/0f3c0970-942b-4dfa-99d2-4961c7054ea5.png"
                  alt="스마트 예약 시스템"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Calendar className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">실시간 예약</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/2243796c-14a7-4519-8d10-9b15445db3b3.png"
                  alt="스마트 출입 시스템"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Shield className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">스마트 출입</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/3a68c7ff-e96e-4fe9-9039-79d1f87c2c0a.png"
                  alt="소형 미팅룸"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Users className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">소형 미팅룸</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/4f8805aa-12a2-4a68-83f1-3d168b76210d.png"
                  alt="AI 자동화 시스템"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Clock className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">AI 자동화</h4>
                </div>
              </div>
            </Card>

            {/* 대형 카드 2 */}
            <div className="md:col-span-2">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative h-64">
                  <Image
                    src="/images/service/58845920-7b30-4491-b2a5-4ae40df7db47.png"
                    alt="모던 회의 공간"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white">
                    <h3 className="text-2xl font-bold mb-3">모던 회의 공간</h3>
                    <p className="text-gray-200 mb-4">창의적 사고를 자극하는 혁신적 디자인</p>
                    <Button className="bg-white/20 hover:bg-white/30 border-white/30">
                      자세히 보기
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/84b80a62-5088-42db-aa96-4d93526d15f4.png"
                  alt="결제 시스템"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <CreditCard className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">간편 결제</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/a35c8dda-8e23-4ce4-b507-e68082735c9a.png"
                  alt="협업 도구"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Building className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">협업 공간</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/ae56948f-9aa5-43ac-9fd9-5c01d11e1d7d.png"
                  alt="프리미엄 시설"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Coffee className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">프리미엄 서비스</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/b53e7f3f-4592-4dbe-a485-e30a2181a064.png"
                  alt="고급 인테리어"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Star className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">고급 인테리어</h4>
                </div>
              </div>
            </Card>

            {/* 마지막 대형 카드 */}
            <div className="md:col-span-2">
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative h-64">
                  <Image
                    src="/images/service/c1c4ab36-bbba-4392-9278-4acf1b2c02d1.png"
                    alt="전체 시설 뷰"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-right">
                    <h3 className="text-2xl font-bold mb-3">완벽한 비즈니스 환경</h3>
                    <p className="text-gray-200 mb-4">성공적인 회의를 위한 모든 것</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      지금 예약하기
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/f1985964-ec7a-4f04-9247-11a004d145bb.png"
                  alt="고객 만족"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <CheckCircle className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">고객 만족</h4>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="/images/service/fdfd1e34-ae5f-40b4-83eb-b6a9af9e2664.png"
                  alt="24/7 서비스"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Smartphone className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold">24/7 서비스</h4>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 서비스 장점 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                왜 space.NEXT를 선택해야 할까요?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                기존 회의실 예약 시스템의 불편함을 완전히 해결한 차세대 솔루션입니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">빠른 예약 프로세스</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      평균 2초 만에 예약 완료. 복잡한 절차 없이 몇 번의 클릭만으로 예약이 끝납니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">보안 및 안전</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      최신 보안 기술로 개인정보를 보호하고, 안전한 출입 관리 시스템을 제공합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Smartphone className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">모바일 최적화</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      모든 기기에서 완벽하게 작동하는 반응형 웹 애플리케이션으로 언제 어디서나 이용 가능합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">팀 협업 지원</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      팀원들과 일정을 공유하고, 효율적인 회의실 사용을 위한 다양한 협업 도구를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-center mb-6">이용 통계</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">자동화율</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2초</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">평균 예약 시간</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">서비스 운영</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">서비스 가용성</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프리미엄 시설 - 이미지 갤러리 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              프리미엄 회의실 시설
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              최첨단 기술과 편안한 환경이 조화를 이룬 프리미엄 회의 공간에서 
              더욱 효과적인 회의를 경험하세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 대형 회의실 */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative h-80 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">대형 컨퍼런스룸</h3>
                  <p className="text-gray-200">최대 20명 수용 가능</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">75인치 4K 디스플레이</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-5 h-5 text-green-600" />
                    <span className="text-sm">기가비트 Wi-Fi</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 소형 회의실 */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative h-80 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">소형 미팅룸</h3>
                  <p className="text-gray-200">4-8명 소규모 회의</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">완전 방음 시설</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-5 h-5 text-orange-600" />
                    <span className="text-sm">무료 음료 서비스</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 시설 특징 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">초고속 인터넷</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                기가비트 속도로 끊김 없는 화상회의와 파일 공유
              </p>
            </Card>
            
            <Card className="group p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Monitor className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">최신 AV 장비</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                4K 디스플레이, 무선 프리젠테이션, 고음질 스피커
              </p>
            </Card>
            
            <Card className="group p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">프라이빗 환경</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                완전 방음 처리로 기밀성과 집중도 보장
              </p>
            </Card>
            
            <Card className="group p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">프리미엄 서비스</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                고급 음료, 간식, 문구류 등 완벽한 서비스
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 고객 후기 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              고객 후기
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              space.NEXT를 이용하고 계신 고객들의 생생한 후기를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "정말 간편하고 빠른 예약 시스템이에요. 더 이상 전화로 예약할 필요가 없어서 너무 편합니다!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">김</span>
                </div>
                <div>
                  <div className="font-semibold">김영희</div>
                  <div className="text-sm text-gray-500">마케팅팀 팀장</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "비접촉 출입 시스템이 정말 혁신적이에요. 카드키를 잃어버릴 걱정도 없고 보안도 강화되었습니다."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">이</span>
                </div>
                <div>
                  <div className="font-semibold">이철수</div>
                  <div className="text-sm text-gray-500">개발팀 리더</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "회의실 시설도 최고이고, 예약부터 결제까지 모든 과정이 매끄럽게 진행됩니다. 강력 추천!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">박</span>
                </div>
                <div>
                  <div className="font-semibold">박민정</div>
                  <div className="text-sm text-gray-500">기획팀 대리</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 space.NEXT를 경험해보세요
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            더 스마트하고 효율적인 회의실 예약 서비스로 업무 효율성을 높여보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              무료 체험 시작하기
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              데모 예약하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
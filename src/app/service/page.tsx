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
      {/* <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
      </section> */}

      {/* 서비스 소개 슬라이드 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              space.NEXT 서비스 소개
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              최첨단 기술과 세련된 디자인이 만나 완성된 프리미엄 회의실 공간을 
              슬라이드로 확인해보세요.
            </p>
          </div>
          
          {/* 메인 슬라이드 */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              {/* 슬라이드 컨테이너 */}
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {serviceFeatures.map((feature, index) => (
                  <div key={feature.id} className="min-w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                      {/* 이미지 영역 */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20`} />
                      </div>
                      
                      {/* 텍스트 영역 */}
                      <div className="flex flex-col justify-center p-8 lg:p-12">
                        <div className="mb-6">
                          <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
                          {feature.subtitle}
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                          {feature.description}
                        </p>
                        
                        {/* 특징 태그 */}
                        <div className="flex flex-wrap gap-3 mb-8">
                          {feature.id === 1 && (
                            <>
                              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                                #4K디스플레이
                              </span>
                              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                                #기가비트WiFi
                              </span>
                              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                                #최대20명
                              </span>
                            </>
                          )}
                          {feature.id === 2 && (
                            <>
                              <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                                #실시간예약
                              </span>
                              <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm font-medium">
                                #간편예약
                              </span>
                              <span className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-sm font-medium">
                                #2초완료
                              </span>
                            </>
                          )}
                          {feature.id === 3 && (
                            <>
                              <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-medium">
                                #QR코드출입
                              </span>
                              <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
                                #비접촉시스템
                              </span>
                              <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm font-medium">
                                #모바일앱
                              </span>
                            </>
                          )}
                          {feature.id === 4 && (
                            <>
                              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                                #소규모회의
                              </span>
                              <span className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm font-medium">
                                #4-8명수용
                              </span>
                              <span className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-sm font-medium">
                                #집중환경
                              </span>
                            </>
                          )}
                          {feature.id === 5 && (
                            <>
                              <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
                                #AI자동화
                              </span>
                              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                                #90%자동화
                              </span>
                              <span className="px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 rounded-full text-sm font-medium">
                                #비용절감
                              </span>
                            </>
                          )}
                          {feature.id === 6 && (
                            <>
                              <span className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-sm font-medium">
                                #모던디자인
                              </span>
                              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                                #창의적공간
                              </span>
                              <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm font-medium">
                                #생산성향상
                              </span>
                            </>
                          )}
                        </div>
                        
                        <Button className="w-fit bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                          자세히 알아보기
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 슬라이드 컨트롤 */}
            <div className="flex items-center justify-between mt-8">
              {/* 이전 버튼 */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              {/* 슬라이드 인디케이터 */}
              <div className="flex items-center space-x-6">
                {/* 점 인디케이터 */}
                <div className="flex space-x-2">
                  {serviceFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSlide === index 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                
                {/* 자동재생 컨트롤 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {isAutoPlay ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      일시정지
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      자동재생
                    </>
                  )}
                </Button>
                
                {/* 슬라이드 카운터 */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSlide + 1} / {serviceFeatures.length}
                </span>
              </div>
              
              {/* 다음 버튼 */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          {/* 추가 서비스 갤러리 그리드 (간소화) */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              추가 서비스 둘러보기
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              space.NEXT가 제공하는 다양한 부가 서비스와 시설을 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src="/images/service/84b80a62-5088-42db-aa96-4d93526d15f4.png"
                  alt="결제 시스템"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <CreditCard className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white text-xl font-bold mb-2">간편 결제</h4>
                  <p className="text-gray-200 text-sm">카드, 모바일 페이, 계좌이체 등 다양한 결제 수단 지원</p>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src="/images/service/a35c8dda-8e23-4ce4-b507-e68082735c9a.png"
                  alt="협업 도구"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Building className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white text-xl font-bold mb-2">협업 공간</h4>
                  <p className="text-gray-200 text-sm">팀 프로젝트와 브레인스토밍을 위한 창의적 공간</p>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src="/images/service/ae56948f-9aa5-43ac-9fd9-5c01d11e1d7d.png"
                  alt="프리미엄 시설"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Coffee className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white text-xl font-bold mb-2">프리미엄 서비스</h4>
                  <p className="text-gray-200 text-sm">고급 음료, 간식, 문구류 등 완벽한 부대 서비스</p>
                </div>
              </div>
            </Card>

            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src="/images/service/fdfd1e34-ae5f-40b4-83eb-b6a9af9e2664.png"
                  alt="24/7 서비스"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Smartphone className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white text-xl font-bold mb-2">24/7 서비스</h4>
                  <p className="text-gray-200 text-sm">언제든지 이용 가능한 무인 자동화 시스템</p>
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

    </div>
  );
}
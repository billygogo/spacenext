'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingPlans = [
  {
    name: 'Basic',
    price: '30,000',
    period: '월',
    description: '소규모 팀을 위한 기본 플랜',
    features: [
      '월 20시간 이용',
      '최대 4명 회의실',
      '기본 예약 시스템',
      '모바일 앱 이용',
      '이메일 고객 지원'
    ],
    popular: false,
    color: 'blue'
  },
  {
    name: 'Professional',
    price: '80,000',
    period: '월',
    description: '성장하는 팀을 위한 프로 플랜',
    features: [
      '월 50시간 이용',
      '최대 12명 회의실',
      '고급 예약 시스템',
      '캘린더 연동',
      '우선 고객 지원',
      '회의실 환경 제어',
      '사용 통계 제공'
    ],
    popular: true,
    color: 'purple'
  },
  {
    name: 'Enterprise',
    price: '200,000',
    period: '월',
    description: '대규모 조직을 위한 엔터프라이즈 플랜',
    features: [
      '무제한 이용',
      '모든 규모 회의실',
      '맞춤형 예약 시스템',
      'API 접근 권한',
      '24/7 전담 지원',
      '고급 분석 도구',
      '커스텀 브랜딩',
      '보안 강화 옵션'
    ],
    popular: false,
    color: 'green'
  }
];

export default function PricingSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            합리적인 <span className="text-blue-600">요금제</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            비즈니스 규모에 맞는 최적의 플랜을 선택하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  가장 인기있는 플랜
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₩{plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 ml-1">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                      className="flex items-center"
                    >
                      <Check className={`w-5 h-5 text-${plan.color}-500 mr-3 flex-shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        : `bg-${plan.color}-600 hover:bg-${plan.color}-700`
                    } text-white font-semibold rounded-lg transition-all duration-200 group`}
                  >
                    플랜 선택하기
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              모든 플랜에 포함된 혜택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                무료 설치 및 설정
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                30일 무료 체험
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                언제든지 플랜 변경 가능
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                취소 수수료 없음
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
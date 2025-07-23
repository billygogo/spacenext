'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { 
  Shield, 
  Clock, 
  Smartphone, 
  Users, 
  CreditCard, 
  Calendar,
  Zap,
  Lock,
  Wifi
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: '24/7 자동화 시스템',
    description: '인공지능 기반 스마트 관리로 언제든지 회의실을 예약하고 이용할 수 있습니다.',
    color: 'blue'
  },
  {
    icon: Smartphone,
    title: '모바일 최적화',
    description: '스마트폰 하나로 예약부터 출입, 결제까지 모든 과정을 간편하게 처리하세요.',
    color: 'green'
  },
  {
    icon: Shield,
    title: '보안 출입 시스템',
    description: 'QR코드와 생체인식을 통한 안전하고 편리한 비접촉 출입 관리시스템.',
    color: 'purple'
  },
  {
    icon: CreditCard,
    title: '자동 결제 시스템',
    description: '사용 시간에 따른 자동 정산과 다양한 결제 수단을 지원합니다.',
    color: 'orange'
  },
  {
    icon: Users,
    title: '팀 협업 도구',
    description: '팀원 초대, 일정 공유, 회의 알림 등 효율적인 협업을 위한 도구를 제공합니다.',
    color: 'pink'
  },
  {
    icon: Zap,
    title: '실시간 현황 파악',
    description: '회의실 이용 현황을 실시간으로 확인하고 최적의 시간에 예약하세요.',
    color: 'yellow'
  },
  {
    icon: Lock,
    title: '프라이버시 보호',
    description: '개인정보와 회의 내용을 철저히 보호하는 보안 시스템을 구축했습니다.',
    color: 'red'
  },
  {
    icon: Wifi,
    title: 'IoT 스마트 제어',
    description: '조명, 온도, 프로젝터 등 회의실 환경을 자동으로 최적화합니다.',
    color: 'cyan'
  },
  {
    icon: Calendar,
    title: '일정 통합 관리',
    description: '구글 캘린더, 아웃룩 등과 연동하여 일정을 통합 관리할 수 있습니다.',
    color: 'indigo'
  }
];

export default function FeaturesSection() {
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
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            왜 <span className="text-blue-600">space.NEXT</span>인가요?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            최첨단 기술과 사용자 중심의 서비스로 회의실 예약의 새로운 표준을 제시합니다
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              지금 바로 체험해보세요
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              무료 체험으로 space.NEXT의 혁신적인 서비스를 경험하세요
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
            >
              무료 체험 시작하기
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
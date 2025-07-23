'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: '김철수',
    company: '스타트업 A',
    position: 'CEO',
    content: 'space.NEXT 덕분에 회의실 예약이 정말 간편해졌어요. 특히 자동화된 시스템이 인상적입니다.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    name: '이영희',
    company: '테크 회사 B',
    position: '프로젝트 매니저',
    content: '팀 협업 기능과 캘린더 연동이 정말 유용해요. 업무 효율성이 크게 향상되었습니다.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: '박민수',
    company: 'IT 컨설팅 C',
    position: 'CTO',
    content: '비접촉 출입 시스템과 자동 결제가 코로나19 시대에 딱 맞는 솔루션이네요.',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: '최수진',
    company: '디자인 스튜디오 D',
    position: '대표',
    content: 'UI/UX가 정말 직관적이고 사용하기 편해요. 클라이언트들도 만족해합니다.',
    rating: 5,
    avatar: '👩‍🎨'
  },
  {
    name: '정현우',
    company: '마케팅 에이전시 E',
    position: '팀장',
    content: '실시간 현황 파악 기능이 정말 유용해요. 회의실 운영이 훨씬 체계적이 되었습니다.',
    rating: 5,
    avatar: '👨‍🏢'
  },
  {
    name: '한소영',
    company: '교육 기관 F',
    position: '운영팀장',
    content: '다양한 규모의 회의실을 효율적으로 관리할 수 있어서 정말 만족스럽습니다.',
    rating: 5,
    avatar: '👩‍🏫'
  }
];

export default function TestimonialsSection() {
  const [inView, setInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
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
            고객들의 <span className="text-blue-600">생생한 후기</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            space.NEXT를 선택한 고객들의 진솔한 이야기를 들어보세요
          </p>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${currentIndex}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-blue-400 mb-4" />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
                             <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                 &quot;{testimonial.content}&quot;
               </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <motion.div
            key={`mobile-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg relative max-w-md mx-auto"
          >
            <Quote className="w-8 h-8 text-blue-400 mb-4" />
            <div className="flex mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
                         <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
               &quot;{testimonials[currentIndex].content}&quot;
             </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-2xl mr-4">
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: testimonials.length - 2 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600 dark:text-gray-300">고객 만족도</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
            <div className="text-gray-600 dark:text-gray-300">활성 사용자</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
            <div className="text-gray-600 dark:text-gray-300">월간 예약</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
            <div className="text-gray-600 dark:text-gray-300">평균 평점</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
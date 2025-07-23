'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar, Building, Users, Settings, LogIn } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { href: '#home', label: 'Home', icon: Building },
    { href: '#about', label: '서비스 소개', icon: Users },
    { href: '/booking', label: '예약하기', icon: Calendar },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              space.NEXT
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === '/booking') {
                      e.preventDefault();
                      router.push('/booking');
                    }
                  }}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>
            <Button variant="outline" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              로그인
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/booking')}
            >
              회의실 예약
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 p-0"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="py-4 space-y-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={(e) => {
                      setIsOpen(false);
                      if (item.href === '/booking') {
                        e.preventDefault();
                        router.push('/booking');
                      }
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
              
              {/* Mobile Actions */}
              <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full justify-start"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                  <span className="ml-2">테마 변경</span>
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push('/booking')}
                >
                  회의실 예약
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
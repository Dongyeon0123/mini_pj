'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Search, User, Menu, X, Play, Home, Film, Tv, Heart, Settings, Shield, Mail, LogOut } from 'lucide-react';
import Button from './common/Button';
import Input from './common/Input';
import { tokenManager } from '../services/api';

const NavContainer = styled.nav`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const NavTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled(Play)`
  width: 2rem;
  height: 2rem;
  fill: currentColor;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex: 1;
  max-width: 500px;
  margin: 0 ${({ theme }) => theme.spacing[8]};
`;

const SearchInput = styled(Input)`
  flex: 1;
  
  input {
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:focus {
      background-color: ${({ theme }) => theme.colors.white};
      border-color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const NavBottom = styled.div`
  display: flex;
  align-items: center;
  height: 3rem;
  gap: ${({ theme }) => theme.spacing[8]};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : 'rgba(255, 255, 255, 0.8)'
  };
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease;
  background-color: ${({ $active }) => 
    $active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
  };

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  z-index: ${({ theme }) => theme.zIndex.dropdown};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.gray[700]
  };
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; role: string } | null>(null);

  // 기본 네비게이션 아이템
  const baseNavItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/movies', label: '영화', icon: Film },
    { href: '/series', label: '시리즈', icon: Tv },
    { href: '/favorites', label: '찜한 콘텐츠', icon: Heart },
    { href: '/contact', label: '연락처', icon: Mail },
  ];

  // 관리자 메뉴
  const adminNavItem = { href: '/admin', label: '관리자', icon: Shield };

  // 사용자 역할에 따른 네비게이션 아이템 생성
  const getNavItems = () => {
    if (userInfo?.role === 'ADMIN') {
      return [...baseNavItems, adminNavItem];
    }
    return baseNavItems;
  };

  const navItems = getNavItems();

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = tokenManager.getToken();
      if (token) {
        setIsLoggedIn(true);
        // localStorage에서 사용자 정보 가져오기 (로그인 시 저장됨)
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
          setUserInfo(JSON.parse(savedUserInfo));
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 주기적으로 로그인 상태 확인 (1초마다)
    const interval = setInterval(checkLoginStatus, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    tokenManager.removeToken();
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserInfo(null);
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavContainer suppressHydrationWarning>
      <NavContent>
        <NavTop>
          <Logo href="/">
            <LogoIcon />
            U+ OTT
          </Logo>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="영화, 시리즈, 배우 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          <UserActions>
            {isLoggedIn ? (
              <>
                <UserButton onClick={() => router.push('/mypage')}>
                  <User size={20} />
                  {userInfo?.name || '사용자'}
                </UserButton>
                <UserButton onClick={handleLogout}>
                  <LogOut size={20} />
                  로그아웃
                </UserButton>
              </>
            ) : (
              <UserButton onClick={() => router.push('/auth/login')}>
                <User size={20} />
                로그인
              </UserButton>
            )}
            <MobileMenuButton onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
          </UserActions>
        </NavTop>

        <NavBottom>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                href={item.href}
                $active={pathname === item.href}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </NavBottom>

        <MobileMenu $isOpen={isMobileMenuOpen}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <MobileNavLink
                key={item.href}
                href={item.href}
                $active={pathname === item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </MobileNavLink>
            );
          })}
        </MobileMenu>
      </NavContent>
    </NavContainer>
  );
}

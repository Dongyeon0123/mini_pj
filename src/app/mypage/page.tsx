'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { 
  User, 
  Settings, 
  CreditCard, 
  Heart, 
  Clock, 
  Download, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  Star,
  Play,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

// 임시 사용자 데이터
const userData = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  subscription: {
    plan: '프리미엄',
    status: '활성',
    nextBilling: '2024-02-15',
    price: '12,900원/월',
  },
  stats: {
    totalWatched: 45,
    totalHours: 120,
    favoriteGenres: ['드라마', '액션', '공포'],
    joinDate: '2023-01-15',
  },
};

const recentWatched = [
  {
    id: 1,
    title: '오징어 게임 2',
    type: 'movie',
    progress: 85,
    lastWatched: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=120&fit=crop',
  },
  {
    id: 2,
    title: '킹덤',
    type: 'series',
    progress: 100,
    lastWatched: '2024-01-18',
    image: 'https://images.unsplash.com/photo-1489599808412-4a4a4a4a4a4a?w=200&h=120&fit=crop',
  },
  {
    id: 3,
    title: '지옥',
    type: 'movie',
    progress: 60,
    lastWatched: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=120&fit=crop',
  },
];

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  padding: ${({ theme }) => theme.spacing[16]} 0;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div<{ $image: string }>`
  width: 8rem;
  height: 8rem;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const AvatarEditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    transform: scale(1.1);
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SubscriptionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background-color: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const MenuIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.span`
  flex: 1;
`;

const MenuArrow = styled.div`
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const RecentWatchedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RecentItem = styled(Card)`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const RecentImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 120px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  transition: width 0.3s ease;
`;

const RecentInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const RecentTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background-color: ${({ $type, theme }) => 
    $type === 'movie' ? theme.colors.primary[100] : theme.colors.info + '20'
  };
  color: ${({ $type, theme }) => 
    $type === 'movie' ? theme.colors.primary[600] : theme.colors.info
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const SubscriptionInfo = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.primary[100]} 100%);
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const SubscriptionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SubscriptionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SubscriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SubscriptionLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SubscriptionValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[800]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LogoutButton = styled(Button)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }
`;

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    console.log('프로필 편집');
  };

  const handleLogout = () => {
    console.log('로그아웃');
    // 실제 로그아웃 로직 구현
  };

  const menuItems = [
    { href: '/mypage/profile', label: '프로필 설정', icon: User },
    { href: '/mypage/subscription', label: '구독 관리', icon: CreditCard },
    { href: '/favorites', label: '찜한 콘텐츠', icon: Heart },
    { href: '/mypage/watch-history', label: '시청 기록', icon: Clock },
    { href: '/mypage/downloads', label: '다운로드', icon: Download },
    { href: '/mypage/notifications', label: '알림 설정', icon: Bell },
    { href: '/mypage/privacy', label: '개인정보 보호', icon: Shield },
    { href: '/mypage/help', label: '고객 지원', icon: HelpCircle },
  ];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <ProfileSection>
            <AvatarContainer>
              <Avatar $image={userData.avatar} />
              <AvatarEditButton onClick={handleEditProfile}>
                <Camera size={16} />
              </AvatarEditButton>
            </AvatarContainer>
            <ProfileInfo>
              <ProfileName>{userData.name}</ProfileName>
              <ProfileEmail>{userData.email}</ProfileEmail>
              <SubscriptionBadge>
                <Star size={16} fill="currentColor" />
                {userData.subscription.plan} 구독자
              </SubscriptionBadge>
            </ProfileInfo>
          </ProfileSection>

          <StatsContainer>
            <StatCard>
              <StatNumber>{userData.stats.totalWatched}</StatNumber>
              <StatLabel>시청한 콘텐츠</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{userData.stats.totalHours}시간</StatNumber>
              <StatLabel>총 시청 시간</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{userData.stats.favoriteGenres.length}</StatNumber>
              <StatLabel>선호 장르</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{new Date(userData.stats.joinDate).getFullYear()}</StatNumber>
              <StatLabel>가입 연도</StatLabel>
            </StatCard>
          </StatsContainer>
        </HeaderContent>
      </Header>

      <Content>
        <ContentGrid>
          <MainContent>
            <Section>
              <SectionTitle>
                <Clock size={24} />
                최근 시청한 콘텐츠
              </SectionTitle>
              <RecentWatchedGrid>
                {recentWatched.map((item) => (
                  <Link key={item.id} href={`/${item.type}s/${item.id}`}>
                    <RecentItem hover>
                      <RecentImage $image={item.image}>
                        <ProgressBar>
                          <ProgressFill $progress={item.progress} />
                        </ProgressBar>
                      </RecentImage>
                      <RecentInfo>
                        <RecentTitle>{item.title}</RecentTitle>
                        <RecentMeta>
                          <TypeBadge $type={item.type}>
                            {item.type === 'movie' ? '영화' : '시리즈'}
                          </TypeBadge>
                          <span>{item.progress}%</span>
                        </RecentMeta>
                      </RecentInfo>
                    </RecentItem>
                  </Link>
                ))}
              </RecentWatchedGrid>
            </Section>
          </MainContent>

          <Sidebar>
            <Section>
              <SectionTitle>
                <Settings size={24} />
                설정
              </SectionTitle>
              <MenuList>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <MenuItem key={item.href} href={item.href}>
                      <MenuIcon>
                        <Icon size={20} />
                      </MenuIcon>
                      <MenuText>{item.label}</MenuText>
                      <MenuArrow>
                        <ChevronRight size={16} />
                      </MenuArrow>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Section>

            <SubscriptionInfo>
              <SubscriptionTitle>구독 정보</SubscriptionTitle>
              <SubscriptionDetails>
                <SubscriptionItem>
                  <SubscriptionLabel>플랜</SubscriptionLabel>
                  <SubscriptionValue>{userData.subscription.plan}</SubscriptionValue>
                </SubscriptionItem>
                <SubscriptionItem>
                  <SubscriptionLabel>상태</SubscriptionLabel>
                  <SubscriptionValue>{userData.subscription.status}</SubscriptionValue>
                </SubscriptionItem>
                <SubscriptionItem>
                  <SubscriptionLabel>다음 결제일</SubscriptionLabel>
                  <SubscriptionValue>
                    {new Date(userData.subscription.nextBilling).toLocaleDateString('ko-KR')}
                  </SubscriptionValue>
                </SubscriptionItem>
                <SubscriptionItem>
                  <SubscriptionLabel>요금</SubscriptionLabel>
                  <SubscriptionValue>{userData.subscription.price}</SubscriptionValue>
                </SubscriptionItem>
              </SubscriptionDetails>
            </SubscriptionInfo>

            <LogoutButton onClick={handleLogout}>
              <LogOut size={20} />
              로그아웃
            </LogoutButton>
          </Sidebar>
        </ContentGrid>
      </Content>
    </Container>
  );
}

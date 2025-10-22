'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  Film, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Play, 
  Heart, 
  Star,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

// 임시 데이터
const stats = {
  totalUsers: 12543,
  totalContent: 2847,
  totalRevenue: 12500000,
  monthlyGrowth: 12.5,
  activeUsers: 8934,
  totalViews: 2456789,
  totalLikes: 156789,
  averageRating: 4.2,
};

const recentUsers = [
  { id: 1, name: '홍길동', email: 'hong@example.com', joinDate: '2024-01-20', status: 'active' },
  { id: 2, name: '김철수', email: 'kim@example.com', joinDate: '2024-01-19', status: 'active' },
  { id: 3, name: '이영희', email: 'lee@example.com', joinDate: '2024-01-18', status: 'inactive' },
  { id: 4, name: '박민수', email: 'park@example.com', joinDate: '2024-01-17', status: 'active' },
  { id: 5, name: '정수진', email: 'jung@example.com', joinDate: '2024-01-16', status: 'active' },
];

const popularContent = [
  { id: 1, title: '오징어 게임 2', type: 'movie', views: 125678, rating: 9.2, status: 'active' },
  { id: 2, title: '킹덤', type: 'series', views: 98765, rating: 8.9, status: 'active' },
  { id: 3, title: '지옥', type: 'movie', views: 87654, rating: 8.5, status: 'active' },
  { id: 4, title: '마이 네임', type: 'series', views: 76543, rating: 8.7, status: 'active' },
  { id: 5, title: '스위트홈', type: 'series', views: 65432, rating: 8.3, status: 'inactive' },
];

const recentActivities = [
  { id: 1, type: 'user_signup', message: '새로운 사용자가 가입했습니다', time: '2분 전', status: 'success' },
  { id: 2, type: 'content_upload', message: '새로운 영화가 업로드되었습니다', time: '15분 전', status: 'info' },
  { id: 3, type: 'payment_received', message: '결제가 완료되었습니다', time: '1시간 전', status: 'success' },
  { id: 4, type: 'content_reported', message: '콘텐츠 신고가 접수되었습니다', time: '2시간 전', status: 'warning' },
  { id: 5, type: 'system_error', message: '시스템 오류가 발생했습니다', time: '3시간 전', status: 'error' },
];

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  padding: ${({ theme }) => theme.spacing[8]} 0;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  position: relative;
  overflow: hidden;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  background-color: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $positive, theme }) => $positive ? theme.colors.success : theme.colors.error};
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const MainSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Table = styled.div`
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'active': return theme.colors.success + '20';
      case 'inactive': return theme.colors.gray[200];
      case 'pending': return theme.colors.warning + '20';
      case 'error': return theme.colors.error + '20';
      default: return theme.colors.gray[200];
    }
  }};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'active': return theme.colors.success;
      case 'inactive': return theme.colors.gray[600];
      case 'pending': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.gray[600];
    }
  }};
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'view' }>`
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'edit': return theme.colors.info + '20';
      case 'delete': return theme.colors.error + '20';
      case 'view': return theme.colors.primary[100];
      default: return theme.colors.gray[100];
    }
  }};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'edit': return theme.colors.info;
      case 'delete': return theme.colors.error;
      case 'view': return theme.colors.primary[600];
      default: return theme.colors.gray[600];
    }
  }};

  &:hover {
    transform: scale(1.1);
    background-color: ${({ $variant, theme }) => {
      switch ($variant) {
        case 'edit': return theme.colors.info + '40';
        case 'delete': return theme.colors.error + '40';
        case 'view': return theme.colors.primary[200];
        default: return theme.colors.gray[200];
      }
    }};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ActivityItem = styled.div<{ $status?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ $status, theme }) => {
    switch ($status) {
      case 'success': return theme.colors.success;
      case 'info': return theme.colors.info;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.gray[300];
    }
  }};
`;

const ActivityIcon = styled.div<{ $status: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'success': return theme.colors.success + '20';
      case 'info': return theme.colors.info + '20';
      case 'warning': return theme.colors.warning + '20';
      case 'error': return theme.colors.error + '20';
      default: return theme.colors.gray[200];
    }
  }};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'success': return theme.colors.success;
      case 'info': return theme.colors.info;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.gray[600];
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const QuickActionCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const QuickActionIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
`;

const QuickActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const QuickActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = recentUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} />;
      case 'info': return <Activity size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderTitle>관리자 대시보드</HeaderTitle>
          <HeaderSubtitle>U+ OTT 플랫폼 관리 및 모니터링</HeaderSubtitle>
        </HeaderContent>
      </Header>

      <Content>
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon $color="#10b981">
                <Users size={24} />
              </StatIcon>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                +5.2%
              </StatTrend>
            </StatHeader>
            <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
            <StatLabel>총 사용자</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon $color="#3b82f6">
                <Film size={24} />
              </StatIcon>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                +12.3%
              </StatTrend>
            </StatHeader>
            <StatNumber>{stats.totalContent.toLocaleString()}</StatNumber>
            <StatLabel>총 콘텐츠</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon $color="#f59e0b">
                <DollarSign size={24} />
              </StatIcon>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                +8.7%
              </StatTrend>
            </StatHeader>
            <StatNumber>₩{(stats.totalRevenue / 1000000).toFixed(1)}M</StatNumber>
            <StatLabel>총 수익</StatLabel>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon $color="#8b5cf6">
                <Eye size={24} />
              </StatIcon>
              <StatTrend $positive={true}>
                <TrendingUp size={16} />
                +15.4%
              </StatTrend>
            </StatHeader>
            <StatNumber>{stats.totalViews.toLocaleString()}</StatNumber>
            <StatLabel>총 조회수</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <MainSection>
            <SectionHeader>
              <SectionTitle>
                <Users size={24} />
                최근 사용자
              </SectionTitle>
              <ActionButtons>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  내보내기
                </Button>
                <Button size="sm">
                  <Plus size={16} />
                  사용자 추가
                </Button>
              </ActionButtons>
            </SectionHeader>

            <SearchContainer>
              <Input
                type="text"
                placeholder="사용자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Filter size={16} />
                필터
              </Button>
            </SearchContainer>

            <Table>
              <TableHeader>
                <div>ID</div>
                <div>이름</div>
                <div>이메일</div>
                <div>가입일</div>
                <div>상태</div>
              </TableHeader>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <div>{user.id}</div>
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                  <div>{new Date(user.joinDate).toLocaleDateString('ko-KR')}</div>
                  <div>
                    <StatusBadge $status={user.status}>
                      {user.status === 'active' ? '활성' : '비활성'}
                    </StatusBadge>
                  </div>
                </TableRow>
              ))}
            </Table>
          </MainSection>

          <MainSection>
            <SectionHeader>
              <SectionTitle>
                <Activity size={24} />
                최근 활동
              </SectionTitle>
            </SectionHeader>

            <ActivityList>
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} $status={activity.status}>
                  <ActivityIcon $status={activity.status}>
                    {getStatusIcon(activity.status)}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityMessage>{activity.message}</ActivityMessage>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </ActivityList>
          </MainSection>
        </ContentGrid>

        <MainSection>
          <SectionHeader>
            <SectionTitle>
              <Film size={24} />
              인기 콘텐츠
            </SectionTitle>
            <ActionButtons>
              <Button variant="outline" size="sm">
                <Upload size={16} />
                콘텐츠 업로드
              </Button>
            </ActionButtons>
          </SectionHeader>

          <Table>
            <TableHeader>
              <div>ID</div>
              <div>제목</div>
              <div>조회수</div>
              <div>평점</div>
              <div>상태</div>
            </TableHeader>
            {popularContent.map((content) => (
              <TableRow key={content.id}>
                <div>{content.id}</div>
                <div>{content.title}</div>
                <div>{content.views.toLocaleString()}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={16} fill="currentColor" color="#fbbf24" />
                    {content.rating}
                  </div>
                </div>
                <div>
                  <StatusBadge $status={content.status}>
                    {content.status === 'active' ? '활성' : '비활성'}
                  </StatusBadge>
                </div>
              </TableRow>
            ))}
          </Table>
        </MainSection>

        <QuickActions>
          <QuickActionCard>
            <QuickActionIcon>
              <Plus size={24} />
            </QuickActionIcon>
            <QuickActionTitle>콘텐츠 추가</QuickActionTitle>
            <QuickActionDescription>새로운 영화나 시리즈를 추가하세요</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard>
            <QuickActionIcon>
              <Users size={24} />
            </QuickActionIcon>
            <QuickActionTitle>사용자 관리</QuickActionTitle>
            <QuickActionDescription>사용자 계정을 관리하고 모니터링하세요</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard>
            <QuickActionIcon>
              <BarChart3 size={24} />
            </QuickActionIcon>
            <QuickActionTitle>통계 보기</QuickActionTitle>
            <QuickActionDescription>상세한 분석 리포트를 확인하세요</QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard>
            <QuickActionIcon>
              <Settings size={24} />
            </QuickActionIcon>
            <QuickActionTitle>시스템 설정</QuickActionTitle>
            <QuickActionDescription>플랫폼 설정을 관리하세요</QuickActionDescription>
          </QuickActionCard>
        </QuickActions>
      </Content>
    </Container>
  );
}

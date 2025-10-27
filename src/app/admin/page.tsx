'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { 
  BarChart3,
  Users, 
  Film, 
  TrendingUp, 
  UserCheck,
  Eye, 
  Heart, 
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Ban
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  adminApi,
  AdminStats,
  UserManagement,
  CreateContentRequest,
  contentApi,
  Content,
  GENRES
} from '../../services/api';

type TabType = 'dashboard' | 'contents' | 'users';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.error} 0%, #c81e1e 100%);
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background-color: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.white : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const Section = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray[100]};
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Badge = styled.span<{ $variant: 'success' | 'error' | 'warning' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case 'warning':
        return `
          background-color: #F59E0B20;
          color: #F59E0B;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const IconButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
          &:hover {
            background-color: ${theme.colors.error};
            color: ${theme.colors.white};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[600]};
  &:hover {
            background-color: ${theme.colors.primary[500]};
            color: ${theme.colors.white};
          }
        `;
    }
  }}
`;

const Modal = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => $show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  background-color: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.gray[500]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 통계
  const [stats, setStats] = useState<AdminStats | null>(null);

  // 회원 관리
  const [users, setUsers] = useState<UserManagement[]>([]);

  // 콘텐츠 관리
  const [contents, setContents] = useState<Content[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [contentForm, setContentForm] = useState<CreateContentRequest>({
    title: '',
    description: '',
    genre: 'Drama',
    year: new Date().getFullYear(),
    rating: 0,
    duration: '',
    image: '',
    thumbnailUrl: '',
    contentType: 'MOVIE',
  });

  // 관리자 권한 확인
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
      
    if (!token || !userStr) {
      alert('로그인이 필요합니다.');
        router.push('/auth/login');
        return;
      }

    const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
          return;
        }
        
    loadDashboard();
  }, [router]);

  // 대시보드 로드
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.message || '통계 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    const loadTabData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'users') {
          const response = await adminApi.getUsers();
          if (response.success && response.data) {
            setUsers(response.data);
          }
        } else if (activeTab === 'contents') {
          const response = await contentApi.getContents('MOVIE', undefined, undefined, 'latest', 0, 100);
          if (response.success && response.data) {
            setContents(response.data.contents);
          }
        }
      } catch (err: any) {
        setError(err.message || '데이터 로드에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== 'dashboard') {
      loadTabData();
    }
  }, [activeTab]);

  // 회원 상태 토글
  const handleToggleUserStatus = async (userId: number) => {
    if (!window.confirm('회원 상태를 변경하시겠습니까?')) return;

    try {
      const response = await adminApi.toggleUserStatus(userId);
      if (response.success) {
        setSuccess('회원 상태가 변경되었습니다.');
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, enabled: !user.enabled } : user
        ));
      }
    } catch (err: any) {
      setError(err.message || '상태 변경에 실패했습니다.');
    }
  };

  // 회원 삭제
  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`"${userName}" 회원을 삭제하시겠습니까?`)) return;

    try {
      const response = await adminApi.deleteUser(userId);
      if (response.success) {
        setSuccess('회원이 삭제되었습니다.');
        setUsers(prev => prev.filter(user => user.id !== userId));
      }
    } catch (err: any) {
      setError(err.message || '회원 삭제에 실패했습니다.');
    }
  };

  // 콘텐츠 추가/수정 모달 열기
  const handleOpenContentModal = (content?: Content) => {
    if (content) {
      setEditingContent(content);
      setContentForm({
        title: content.title,
        description: content.description,
        genre: content.genre,
        year: content.year,
        rating: content.rating,
        duration: content.duration,
        episodes: content.episodes,
        seasons: content.seasons,
        image: content.image,
        thumbnailUrl: content.thumbnailUrl || content.image,
        contentType: content.contentType as 'MOVIE' | 'SERIES',
        trailerUrl: content.trailerUrl,
        videoUrl: content.videoUrl,
        director: content.director,
        cast: content.cast,
        ageRating: content.ageRating,
        country: content.country,
        language: content.language,
        tags: content.tags,
      });
    } else {
      setEditingContent(null);
      setContentForm({
        title: '',
        description: '',
        genre: 'Drama',
        year: new Date().getFullYear(),
        rating: 0,
        duration: '',
        image: '',
        thumbnailUrl: '',
        contentType: 'MOVIE',
      });
    }
    setShowContentModal(true);
  };

  // 콘텐츠 저장
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (editingContent) {
        // 수정
        const response = await adminApi.updateContent(editingContent.id, contentForm);
        if (response.success) {
          setSuccess('콘텐츠가 수정되었습니다.');
          setContents(prev => prev.map(c => 
            c.id === editingContent.id ? { ...c, ...contentForm } : c
          ));
        }
      } else {
        // 추가
        const response = await adminApi.createContent(contentForm);
        if (response.success && response.data) {
          setSuccess('콘텐츠가 추가되었습니다.');
          const newContent: Content = {
            id: response.data.id,
            ...contentForm,
            viewCount: 0,
            likeCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setContents(prev => [newContent, ...prev]);
        }
      }
      
      setShowContentModal(false);
    } catch (err: any) {
      setError(err.message || '콘텐츠 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 콘텐츠 삭제
  const handleDeleteContent = async (contentId: number, title: string) => {
    if (!window.confirm(`"${title}" 콘텐츠를 삭제하시겠습니까?`)) return;

    try {
      const response = await adminApi.deleteContent(contentId);
      if (response.success) {
        setSuccess('콘텐츠가 삭제되었습니다.');
        setContents(prev => prev.filter(c => c.id !== contentId));
      }
    } catch (err: any) {
      setError(err.message || '콘텐츠 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  if (loading && !stats && !users.length && !contents.length) {
    return (
      <Container>
        <LoadingSpinner>로딩 중...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>
            <BarChart3 size={40} />
            관리자 페이지
          </Title>
          
          <TabContainer>
            <Tab $active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
              <TrendingUp size={20} />
              대시보드
            </Tab>
            <Tab $active={activeTab === 'contents'} onClick={() => setActiveTab('contents')}>
              <Film size={20} />
              콘텐츠 관리
            </Tab>
            <Tab $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
              <Users size={20} />
              회원 관리
            </Tab>
          </TabContainer>
        </HeaderContent>
      </Header>

      <Content>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {/* 대시보드 탭 */}
        {activeTab === 'dashboard' && stats && (
          <>
        <StatsGrid>
          <StatCard>
                <StatIcon $color="#3B82F6">
                <Users size={24} />
              </StatIcon>
                <StatInfo>
                  <StatLabel>전체 회원</StatLabel>
                  <StatValue>{formatNumber(stats.totalUsers)}</StatValue>
                </StatInfo>
          </StatCard>

          <StatCard>
                <StatIcon $color="#10B981">
                <Film size={24} />
              </StatIcon>
                <StatInfo>
                  <StatLabel>전체 콘텐츠</StatLabel>
                  <StatValue>{formatNumber(stats.totalContents)}</StatValue>
                </StatInfo>
          </StatCard>

          <StatCard>
                <StatIcon $color="#F59E0B">
                  <Eye size={24} />
              </StatIcon>
                <StatInfo>
                  <StatLabel>총 시청 횟수</StatLabel>
                  <StatValue>{formatNumber(stats.totalViews)}</StatValue>
                </StatInfo>
          </StatCard>

          <StatCard>
                <StatIcon $color="#EF4444">
                  <Heart size={24} />
              </StatIcon>
                <StatInfo>
                  <StatLabel>총 찜하기</StatLabel>
                  <StatValue>{formatNumber(stats.totalFavorites)}</StatValue>
                </StatInfo>
          </StatCard>

              <StatCard>
                <StatIcon $color="#8B5CF6">
                  <UserCheck size={24} />
                </StatIcon>
                <StatInfo>
                  <StatLabel>오늘 활성 사용자</StatLabel>
                  <StatValue>{formatNumber(stats.activeUsersToday)}</StatValue>
                </StatInfo>
              </StatCard>

              <StatCard>
                <StatIcon $color="#06B6D4">
                  <Calendar size={24} />
                </StatIcon>
                <StatInfo>
                  <StatLabel>이번 달 신규 가입</StatLabel>
                  <StatValue>{formatNumber(stats.newUsersThisMonth)}</StatValue>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            <Section>
              <SectionTitle>인기 콘텐츠 Top 10</SectionTitle>
            <Table>
                <Thead>
                  <Tr>
                    <Th>순위</Th>
                    <Th>제목</Th>
                    <Th>타입</Th>
                    <Th>조회수</Th>
                    <Th>찜하기</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.popularContents.map((content, index) => (
                    <Tr key={content.contentId}>
                      <Td>{index + 1}</Td>
                      <Td>{content.title}</Td>
                      <Td>
                        <Badge $variant={content.type === 'MOVIE' ? 'success' : 'warning'}>
                          {content.type === 'MOVIE' ? '영화' : '시리즈'}
                        </Badge>
                      </Td>
                      <Td>{formatNumber(content.viewCount)}</Td>
                      <Td>{formatNumber(content.favoriteCount)}</Td>
                    </Tr>
                  ))}
                </Tbody>
            </Table>
            </Section>
          </>
        )}

        {/* 콘텐츠 관리 탭 */}
        {activeTab === 'contents' && (
          <Section>
              <SectionTitle>
              콘텐츠 목록
              <Button onClick={() => handleOpenContentModal()}>
                <Plus size={20} />
                콘텐츠 추가
              </Button>
              </SectionTitle>
            
            {loading ? (
              <LoadingSpinner>로딩 중...</LoadingSpinner>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>제목</Th>
                    <Th>타입</Th>
                    <Th>장르</Th>
                    <Th>평점</Th>
                    <Th>조회수</Th>
                    <Th>작업</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contents.map((content) => (
                    <Tr key={content.id}>
                      <Td>{content.id}</Td>
                      <Td>{content.title}</Td>
                      <Td>
                        <Badge $variant={content.contentType === 'MOVIE' ? 'success' : 'warning'}>
                          {content.contentType === 'MOVIE' ? '영화' : '시리즈'}
                        </Badge>
                      </Td>
                      <Td>{content.genre}</Td>
                      <Td>⭐ {content.rating}</Td>
                      <Td>{formatNumber(content.viewCount)}</Td>
                      <Td>
            <ActionButtons>
                          <IconButton onClick={() => handleOpenContentModal(content)}>
                            <Edit size={16} />
                          </IconButton>
                          <IconButton $variant="danger" onClick={() => handleDeleteContent(content.id, content.title)}>
                            <Trash2 size={16} />
                          </IconButton>
            </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Section>
        )}

        {/* 회원 관리 탭 */}
        {activeTab === 'users' && (
          <Section>
            <SectionTitle>회원 목록</SectionTitle>
            
            {loading ? (
              <LoadingSpinner>로딩 중...</LoadingSpinner>
            ) : (
          <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>이메일</Th>
                    <Th>이름</Th>
                    <Th>역할</Th>
                    <Th>상태</Th>
                    <Th>시청 횟수</Th>
                    <Th>찜하기</Th>
                    <Th>가입일</Th>
                    <Th>작업</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.id}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.name}</Td>
                      <Td>
                        <Badge $variant={user.role === 'ADMIN' ? 'error' : 'success'}>
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge $variant={user.enabled ? 'success' : 'error'}>
                          {user.enabled ? '활성' : '비활성'}
                        </Badge>
                      </Td>
                      <Td>{formatNumber(user.totalWatchCount)}</Td>
                      <Td>{formatNumber(user.totalFavoriteCount)}</Td>
                      <Td>{formatDate(user.createdAt)}</Td>
                      <Td>
                        <ActionButtons>
                          <IconButton onClick={() => handleToggleUserStatus(user.id)}>
                            {user.enabled ? <Ban size={16} /> : <Check size={16} />}
                          </IconButton>
                          <IconButton $variant="danger" onClick={() => handleDeleteUser(user.id, user.name)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
          </Table>
            )}
          </Section>
        )}
      </Content>

      {/* 콘텐츠 추가/수정 모달 */}
      <Modal $show={showContentModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingContent ? '콘텐츠 수정' : '콘텐츠 추가'}</ModalTitle>
            <CloseButton onClick={() => setShowContentModal(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSaveContent}>
            <FormGroup>
              <Label>제목 *</Label>
              <Input
                type="text"
                value={contentForm.title}
                onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                placeholder="콘텐츠 제목"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>설명 *</Label>
              <TextArea
                value={contentForm.description}
                onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                placeholder="콘텐츠 설명"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>타입 *</Label>
              <Select
                value={contentForm.contentType}
                onChange={(e) => setContentForm({ ...contentForm, contentType: e.target.value as 'MOVIE' | 'SERIES' })}
              >
                <option value="MOVIE">영화</option>
                <option value="SERIES">시리즈</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>장르 *</Label>
              <Select
                value={contentForm.genre}
                onChange={(e) => setContentForm({ ...contentForm, genre: e.target.value })}
              >
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>개봉 연도 *</Label>
              <Input
                type="number"
                value={contentForm.year}
                onChange={(e) => setContentForm({ ...contentForm, year: parseInt(e.target.value) })}
                placeholder="2024"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>평점 *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={contentForm.rating}
                onChange={(e) => setContentForm({ ...contentForm, rating: parseFloat(e.target.value) })}
                placeholder="0.0"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>러닝타임 *</Label>
              <Input
                type="text"
                value={contentForm.duration}
                onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                placeholder="120분"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>이미지 URL *</Label>
              <Input
                type="text"
                value={contentForm.image}
                onChange={(e) => setContentForm({ ...contentForm, image: e.target.value, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>비디오 URL</Label>
              <Input
                type="text"
                value={contentForm.videoUrl || ''}
                onChange={(e) => setContentForm({ ...contentForm, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </FormGroup>

            <FormGroup>
              <Label>예고편 URL</Label>
              <Input
                type="text"
                value={contentForm.trailerUrl || ''}
                onChange={(e) => setContentForm({ ...contentForm, trailerUrl: e.target.value })}
                placeholder="https://example.com/trailer.mp4"
              />
            </FormGroup>

            <FormActions>
              <CancelButton type="button" onClick={() => setShowContentModal(false)}>
                취소
              </CancelButton>
              <Button type="submit" disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </Button>
            </FormActions>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
}

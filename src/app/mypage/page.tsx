'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { 
  User, 
  Clock, 
  Heart, 
  Lock,
  LogOut,
  Star,
  Calendar,
  Play,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { 
  userApi, 
  UserProfile,
  watchHistoryApi, 
  WatchHistoryResponse,
  favoriteApi,
  FavoriteResponse
} from '../../services/api';

type TabType = 'watch-history' | 'favorites' | 'profile' | 'password' | 'subscription';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[6]};
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
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[300]}, ${({ theme }) => theme.colors.primary[500]});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  border: 3px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
`;

const TabContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background-color: ${({ $active, theme }) => 
    $active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
  };
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.white : 'transparent'
  };
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
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
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
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ContentCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const ContentImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 140px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
`;

const ContentInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ContentTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const TypeBadge = styled.span<{ $type: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background-color: ${({ $type, theme }) => 
    $type === 'MOVIE' ? theme.colors.primary[100] : theme.colors.info + '20'
  };
  color: ${({ $type, theme }) => 
    $type === 'MOVIE' ? theme.colors.primary[600] : theme.colors.info
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const RemoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const SubscriptionInfo = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.primary[100]} 100%);
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  text-align: center;
`;

const SubscriptionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SubscriptionPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const SubscriptionFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing[6]} 0;
  text-align: left;
`;

const SubscriptionFeature = styled.li`
  padding: ${({ theme }) => theme.spacing[3]} 0;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-right: ${({ theme }) => theme.spacing[3]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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

const LogoutButtonStyled = styled(Button)`
  margin-left: auto;
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.gray[500]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const DangerButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.error};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }
`;

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('watch-history');
  const [userId, setUserId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryResponse[]>([]);
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 프로필 수정 폼
  const [profileForm, setProfileForm] = useState({ name: '', phoneNumber: '' });
  
  // 비밀번호 변경 폼
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 로그인 확인 및 사용자 정보 로드
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(userStr);
    setUserId(user.id);
    loadUserProfile(user.id);
  }, [router]);

  // 프로필 로드
  const loadUserProfile = async (id: number) => {
    try {
      setLoading(true);
      const response = await userApi.getUserProfile(id);
      if (response.success && response.data) {
        setUserProfile(response.data);
        setProfileForm({
          name: response.data.name,
          phoneNumber: response.data.phoneNumber || ''
        });
      }
    } catch (err) {
      console.error('프로필 로드 실패:', err);
      setError('프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (!userId) return;

    const loadTabData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'watch-history') {
          const response = await watchHistoryApi.getUserWatchHistory(userId);
          if (response.success && response.data) {
            setWatchHistory(response.data);
          }
        } else if (activeTab === 'favorites') {
          const response = await favoriteApi.getUserFavorites(userId);
          if (response.success && response.data) {
            setFavorites(response.data);
          }
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, userId]);

  // 프로필 수정 제출
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userApi.updateProfile(userId, profileForm);
      
      if (response.success) {
        setSuccess('프로필이 수정되었습니다.');
        if (response.data) {
          setUserProfile(response.data);
          // localStorage 업데이트
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.name = response.data.name;
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      }
    } catch (err: any) {
      setError(err.message || '프로필 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경 제출
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userApi.changePassword(userId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.success) {
        setSuccess('비밀번호가 변경되었습니다.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 시청 기록 삭제
  const handleDeleteWatchHistory = async (userId: number, contentId: number, historyId: number) => {
    if (!window.confirm('시청 기록을 삭제하시겠습니까?')) return;

    try {
      const response = await watchHistoryApi.deleteWatchHistory(userId, contentId);
      if (response.success) {
        setWatchHistory(prev => prev.filter(item => item.id !== historyId));
        setSuccess('시청 기록이 삭제되었습니다.');
      }
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  // 찜하기 삭제
  const handleDeleteFavorite = async (userId: number, contentId: number, favoriteId: number, contentTitle: string) => {
    if (!window.confirm(`"${contentTitle}"을(를) 찜 목록에서 삭제하시겠습니까?`)) return;

    try {
      const response = await favoriteApi.removeFavorite(userId, contentId);
      if (response.success) {
        setFavorites(prev => prev.filter(item => item.id !== favoriteId));
        setSuccess('찜 목록에서 삭제되었습니다.');
      }
    } catch (err: any) {
      setError(err.message || '삭제에 실패했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatWatchProgress = (position: number, duration: number) => {
    if (duration === 0) return 0;
    return Math.floor((position / duration) * 100);
  };

  if (loading && !userProfile) {
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
          <ProfileSection>
            <Avatar>{getInitial(userProfile?.name || '')}</Avatar>
            <ProfileInfo>
              <ProfileName>{userProfile?.name || '사용자'}</ProfileName>
              <ProfileEmail>{userProfile?.email || ''}</ProfileEmail>
            </ProfileInfo>
            <LogoutButtonStyled onClick={handleLogout}>
              <LogOut size={20} />
              로그아웃
            </LogoutButtonStyled>
          </ProfileSection>

          <TabContainer>
            <TabList>
              <Tab 
                $active={activeTab === 'watch-history'}
                onClick={() => setActiveTab('watch-history')}
              >
                <Clock size={20} />
                시청 기록
              </Tab>
              <Tab 
                $active={activeTab === 'favorites'}
                onClick={() => setActiveTab('favorites')}
              >
                <Heart size={20} />
                찜한 콘텐츠
              </Tab>
              <Tab 
                $active={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                프로필 수정
              </Tab>
              <Tab 
                $active={activeTab === 'password'}
                onClick={() => setActiveTab('password')}
              >
                <Lock size={20} />
                비밀번호 변경
              </Tab>
              <Tab 
                $active={activeTab === 'subscription'}
                onClick={() => setActiveTab('subscription')}
              >
                <Star size={20} />
                구독 정보
              </Tab>
            </TabList>
          </TabContainer>
        </HeaderContent>
      </Header>

      <Content>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {/* 시청 기록 탭 */}
        {activeTab === 'watch-history' && (
            <Section>
              <SectionTitle>
                <Clock size={24} />
              시청 기록
              </SectionTitle>
            {loading ? (
              <LoadingSpinner>로딩 중...</LoadingSpinner>
            ) : watchHistory.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📺</EmptyIcon>
                <EmptyText>시청 기록이 없습니다.</EmptyText>
                <Button onClick={() => router.push('/movies')}>콘텐츠 둘러보기</Button>
              </EmptyState>
            ) : (
              <Grid>
                {watchHistory.map((item) => (
                  <ContentCard key={item.id} hover>
                    <ContentImage 
                      $image={item.contentImage || '/placeholder.jpg'}
                      onClick={() => router.push(`/${item.contentType === 'MOVIE' ? 'movies' : 'series'}/${item.contentId}`)}
                    >
                        <ProgressBar>
                        <ProgressFill 
                          $progress={formatWatchProgress(item.watchPosition, item.watchDuration)} 
                        />
                        </ProgressBar>
                    </ContentImage>
                    <ContentInfo>
                      <ContentTitle>{item.contentTitle}</ContentTitle>
                      <ContentMeta>
                        <TypeBadge $type={item.contentType}>
                          {item.contentType === 'MOVIE' ? '영화' : '시리즈'}
                        </TypeBadge>
                        <span>{formatWatchProgress(item.watchPosition, item.watchDuration)}%</span>
                      </ContentMeta>
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ color: '#666' }}>{formatDate(item.lastWatchedAt)}</small>
                        <RemoveButton onClick={() => handleDeleteWatchHistory(item.userId, item.contentId, item.id)}>
                          <Trash2 size={12} />
                          삭제
                        </RemoveButton>
                      </div>
                    </ContentInfo>
                  </ContentCard>
                ))}
              </Grid>
            )}
          </Section>
        )}

        {/* 찜한 콘텐츠 탭 */}
        {activeTab === 'favorites' && (
          <Section>
            <SectionTitle>
              <Heart size={24} />
              찜한 콘텐츠
            </SectionTitle>
            {loading ? (
              <LoadingSpinner>로딩 중...</LoadingSpinner>
            ) : favorites.length === 0 ? (
              <EmptyState>
                <EmptyIcon>❤️</EmptyIcon>
                <EmptyText>찜한 콘텐츠가 없습니다.</EmptyText>
                <Button onClick={() => router.push('/movies')}>콘텐츠 둘러보기</Button>
              </EmptyState>
            ) : (
              <Grid>
                {favorites.map((item) => (
                  <ContentCard key={item.id} hover>
                    <ContentImage 
                      $image={item.contentImage || '/placeholder.jpg'}
                      onClick={() => router.push(`/${item.contentType === 'MOVIE' ? 'movies' : 'series'}/${item.contentId}`)}
                    />
                    <ContentInfo>
                      <ContentTitle>{item.contentTitle}</ContentTitle>
                      <ContentMeta>
                        <TypeBadge $type={item.contentType}>
                          {item.contentType === 'MOVIE' ? '영화' : '시리즈'}
                          </TypeBadge>
                      </ContentMeta>
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ color: '#666' }}>{formatDate(item.createdAt)}</small>
                        <RemoveButton onClick={() => handleDeleteFavorite(item.userId, item.contentId, item.id, item.contentTitle)}>
                          <Trash2 size={12} />
                          삭제
                        </RemoveButton>
                      </div>
                    </ContentInfo>
                  </ContentCard>
                ))}
              </Grid>
            )}
          </Section>
        )}

        {/* 프로필 수정 탭 */}
        {activeTab === 'profile' && (
          <Section>
            <SectionTitle>
              <User size={24} />
              프로필 수정
            </SectionTitle>
            <form onSubmit={handleProfileSubmit}>
              <FormGroup>
                <Label>이메일</Label>
                <Input
                  type="email"
                  value={userProfile?.email || ''}
                  disabled
                  placeholder="이메일"
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                  이메일은 변경할 수 없습니다.
                </small>
              </FormGroup>

              <FormGroup>
                <Label>이름</Label>
                <Input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="이름"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>전화번호</Label>
                <Input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                  placeholder="010-0000-0000"
                />
              </FormGroup>

              <FormGroup>
                <Label>가입일</Label>
                <Input
                  type="text"
                  value={userProfile ? formatDate(userProfile.createdAt) : ''}
                  disabled
                />
              </FormGroup>

              <FormActions>
                <Button type="submit" disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </Button>
              </FormActions>
            </form>
            </Section>
        )}

        {/* 비밀번호 변경 탭 */}
        {activeTab === 'password' && (
            <Section>
              <SectionTitle>
              <Lock size={24} />
              비밀번호 변경
              </SectionTitle>
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label>현재 비밀번호</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="현재 비밀번호"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>새 비밀번호</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="새 비밀번호 (최소 6자)"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>새 비밀번호 확인</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="새 비밀번호 확인"
                  required
                />
              </FormGroup>

              <FormActions>
                <CancelButton 
                  type="button" 
                  onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                >
                  취소
                </CancelButton>
                <Button type="submit" disabled={loading}>
                  {loading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </FormActions>
            </form>
            </Section>
        )}

        {/* 구독 정보 탭 */}
        {activeTab === 'subscription' && (
          <Section>
            <SectionTitle>
              <Star size={24} />
              구독 정보
            </SectionTitle>
            <SubscriptionInfo>
              <SubscriptionTitle>
                <Star size={28} fill="currentColor" />
                프리미엄 플랜
              </SubscriptionTitle>
              <SubscriptionPrice>₩12,900 / 월</SubscriptionPrice>
              <SubscriptionFeatures>
                <SubscriptionFeature>4K 고화질 스트리밍</SubscriptionFeature>
                <SubscriptionFeature>무제한 시청</SubscriptionFeature>
                <SubscriptionFeature>최대 4개 기기 동시 시청</SubscriptionFeature>
                <SubscriptionFeature>다운로드 기능</SubscriptionFeature>
                <SubscriptionFeature>광고 없음</SubscriptionFeature>
                <SubscriptionFeature>독점 콘텐츠 제공</SubscriptionFeature>
              </SubscriptionFeatures>
              <div style={{ marginTop: '24px' }}>
                <p style={{ color: '#666', marginBottom: '8px' }}>
                  다음 결제일: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                </p>
                <p style={{ color: '#666' }}>
                  상태: <span style={{ color: '#10B981', fontWeight: 'bold' }}>활성</span>
                </p>
              </div>
              <DangerButton>
                구독 취소
              </DangerButton>
            </SubscriptionInfo>
          </Section>
        )}
      </Content>
    </Container>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Play, Plus, Star, Heart, Trash2, Grid, List, Film, Tv, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { favoriteApi, ContentType, FavoriteResponse } from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Header = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: ${({ theme }) => theme.spacing[16]} 0;
  color: ${({ theme }) => theme.colors.gray[800]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 40%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-30px, 30px) rotate(180deg); }
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 2;
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const HeaderSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  text-align: center;
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.8;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const TypeFilter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

const TypeButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.white
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : theme.colors.gray[700]
  };
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.gray[50]
    };
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.white
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : theme.colors.gray[700]
  };
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.gray[50]
    };
  }
`;

const ContentGrid = styled.div<{ $view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${({ $view }) => 
    $view === 'grid' 
      ? 'repeat(auto-fill, minmax(200px, 1fr))' 
      : '1fr'
  };
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ContentCard = styled(Card)<{ $view: 'grid' | 'list' }>`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: ${({ $view }) => $view === 'list' ? 'flex' : 'block'};
  position: relative;
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.gray[50]} 100%);
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}20 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px ${({ theme }) => theme.colors.primary[200]};
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
`;

const ContentImage = styled.div<{ $image: string; $view: 'grid' | 'list' }>`
  width: ${({ $view }) => $view === 'list' ? '200px' : '100%'};
  height: ${({ $view }) => $view === 'list' ? '120px' : '300px'};
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: ${({ $view }) => $view === 'list' ? '100px' : '225px'};
  }
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ContentCard}:hover & {
    opacity: 1;
  }
`;

const OverlayContent = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PlayIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-right: ${({ theme }) => theme.spacing[3]};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(239, 68, 68, 0.8);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.9;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  ${ContentCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
  }

  &:active {
    transform: scale(1.05);
  }
`;

const ContentInfo = styled.div<{ $view: 'grid' | 'list' }>`
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[800]};
  flex: 1;
`;

const ContentTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  flex-wrap: wrap;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning};
`;

const TypeIcon = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const RemoveAllButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
    border-color: ${({ theme }) => theme.colors.error};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddedDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyIcon = styled.div`
  width: 8rem;
  height: 8rem;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: ${({ theme }) => theme.colors.primary[500]};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  color: ${({ theme }) => theme.colors.error};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  max-width: 500px;
`;

export default function FavoritesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'all' | 'MOVIE' | 'SERIES'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // 로그인 확인 및 찜하기 목록 불러오기
  useEffect(() => {
    const checkAuthAndLoadFavorites = async () => {
      try {
        // 1. 로그인 확인
        const token = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');
        
        console.log('🔍 로그인 확인 중...');
        console.log('Token:', token ? '존재함' : '없음');
        console.log('User Data:', userDataStr ? '존재함' : '없음');
        
        if (!token || !userDataStr) {
          console.warn('⚠️ 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          router.push('/auth/login?redirect=/favorites');
          return;
        }

        const userData = JSON.parse(userDataStr);
        setUserId(userData.id);
        console.log('👤 사용자 정보:', userData);

        // 2. 찜하기 목록 불러오기
        console.log('📋 찜하기 목록 불러오는 중... userId:', userData.id);
        const response = await favoriteApi.getUserFavorites(userData.id);

        console.log('📡 API 응답:', response);
        console.log('📊 응답 success:', response.success);
        console.log('📊 응답 data:', response.data);
        console.log('📊 응답 data 길이:', response.data?.length);

        if (response.success && response.data) {
          setFavorites(response.data);
          console.log('✅ 찜하기 목록 불러오기 성공, 개수:', response.data.length);
          console.log('📝 첫 번째 아이템:', response.data[0]);
        } else {
          console.error('❌ 찜하기 목록 불러오기 실패:', response.message);
          setError(response.message || '찜하기 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('❌ 찜하기 목록 불러오기 실패:', err);
        setError('찜하기 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadFavorites();
  }, [router]);

  // 필터링된 콘텐츠
  const filteredContent = favorites.filter(favorite => {
    if (selectedType === 'all') return true;
    return favorite.contentType === selectedType;
  });

  const movieCount = favorites.filter(fav => fav.contentType === 'MOVIE').length;
  const seriesCount = favorites.filter(fav => fav.contentType === 'SERIES').length;

  const handlePlay = (contentId: number) => {
    console.log('▶️ 재생 시작:', contentId);
  };

  const handleRemove = async (contentId: number, contentTitle: string) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    // 확인 다이얼로그
    const confirmed = window.confirm(`"${contentTitle}"을(를) 찜 목록에서 제거하시겠습니까?`);
    if (!confirmed) return;

    try {
      console.log('🗑️ 찜하기 제거 중... userId:', userId, 'contentId:', contentId);
      const response = await favoriteApi.removeFavorite(userId, contentId);
      console.log('📊 찜하기 제거 응답:', response);

      if (response.success) {
        // UI에서 즉시 제거 (낙관적 업데이트)
        setFavorites(prev => prev.filter(fav => fav.contentId !== contentId));
        console.log('✅ 찜하기 제거 성공');
        alert(`"${contentTitle}"이(가) 찜 목록에서 제거되었습니다.`);
      } else {
        alert(response.message || '찜하기 제거에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ 찜하기 제거 실패:', err);
      alert('찜하기 제거 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleRemoveAll = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    if (favorites.length === 0) {
      alert('삭제할 찜 목록이 없습니다.');
      return;
    }

    // 확인 다이얼로그
    const confirmed = window.confirm(
      `찜한 콘텐츠 ${favorites.length}개를 모두 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!confirmed) return;

    try {
      console.log('🗑️ 전체 찜하기 제거 중... count:', favorites.length);
      
      // 모든 찜하기를 순차적으로 제거
      let successCount = 0;
      let failCount = 0;

      for (const favorite of favorites) {
        try {
          const response = await favoriteApi.removeFavorite(userId, favorite.contentId);
          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error('개별 찜하기 제거 실패:', favorite.contentId, err);
          failCount++;
        }
      }

      // 모든 작업 완료 후 UI 업데이트
      setFavorites([]);
      
      if (failCount === 0) {
        alert(`찜 목록 ${successCount}개가 모두 제거되었습니다.`);
      } else {
        alert(`${successCount}개 제거 성공, ${failCount}개 실패했습니다.`);
        // 실패한 경우 목록 새로고침
        window.location.reload();
      }

      console.log(`✅ 전체 제거 완료 - 성공: ${successCount}, 실패: ${failCount}`);
    } catch (err) {
      console.error('❌ 전체 찜하기 제거 실패:', err);
      alert('찜 목록 전체 삭제 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <HeaderTitle>
              <Heart size={48} fill="currentColor" />
              찜한 콘텐츠
            </HeaderTitle>
            <HeaderSubtitle>마음에 드는 콘텐츠를 모아보세요</HeaderSubtitle>
          </HeaderContent>
        </Header>
        <Content>
          <LoadingContainer>
            <Loader2 size={48} className="animate-spin" />
            <LoadingText>찜한 콘텐츠를 불러오는 중...</LoadingText>
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <HeaderTitle>
              <Heart size={48} fill="currentColor" />
              찜한 콘텐츠
            </HeaderTitle>
            <HeaderSubtitle>마음에 드는 콘텐츠를 모아보세요</HeaderSubtitle>
          </HeaderContent>
        </Header>
        <Content>
          <ErrorContainer>
            <Heart size={64} color="currentColor" />
            <ErrorText>{error}</ErrorText>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </ErrorContainer>
        </Content>
      </Container>
    );
  }

  // 찜한 콘텐츠가 없는 경우
  if (favorites.length === 0) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <HeaderTitle>
              <Heart size={48} fill="currentColor" />
              찜한 콘텐츠
            </HeaderTitle>
            <HeaderSubtitle>마음에 드는 콘텐츠를 찜해보세요</HeaderSubtitle>
          </HeaderContent>
        </Header>

        <Content>
          <EmptyState>
            <EmptyIcon>
              <Heart size={48} />
            </EmptyIcon>
            <EmptyTitle>찜한 콘텐츠가 없습니다</EmptyTitle>
            <EmptyDescription>
              마음에 드는 영화나 시리즈를 찜하면 여기에 표시됩니다.
            </EmptyDescription>
            <Link href="/movies">
              <Button size="lg">
                콘텐츠 둘러보기
              </Button>
            </Link>
          </EmptyState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderTitle>
            <Heart size={48} fill="currentColor" />
            찜한 콘텐츠
          </HeaderTitle>
          <HeaderSubtitle>마음에 드는 콘텐츠를 모아보세요</HeaderSubtitle>
          
          <StatsContainer>
            <StatItem>
              <StatNumber>{favorites.length}</StatNumber>
              <StatLabel>전체</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{movieCount}</StatNumber>
              <StatLabel>영화</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{seriesCount}</StatNumber>
              <StatLabel>시리즈</StatLabel>
            </StatItem>
          </StatsContainer>
        </HeaderContent>
      </Header>

      <Content>
        <FilterSection>
          <FilterGroup>
            <TypeFilter>
              <TypeButton
                $active={selectedType === 'all'}
                onClick={() => setSelectedType('all')}
              >
                전체
              </TypeButton>
              <TypeButton
                $active={selectedType === 'MOVIE'}
                onClick={() => setSelectedType('MOVIE')}
              >
                <Film size={16} />
                영화
              </TypeButton>
              <TypeButton
                $active={selectedType === 'SERIES'}
                onClick={() => setSelectedType('SERIES')}
              >
                <Tv size={16} />
                시리즈
              </TypeButton>
            </TypeFilter>
            
            <RemoveAllButton 
              onClick={handleRemoveAll}
              disabled={favorites.length === 0}
            >
              <Trash2 size={16} />
              전체 삭제 ({favorites.length})
            </RemoveAllButton>
          </FilterGroup>

          <ViewToggle>
            <ViewButton
              $active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
              그리드
            </ViewButton>
            <ViewButton
              $active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
              리스트
            </ViewButton>
          </ViewToggle>
        </FilterSection>

        <ContentGrid $view={viewMode}>
          {filteredContent.map((favorite) => {
            const contentPath = favorite.contentType === 'MOVIE' ? 'movies' : 'series';
            return (
              <Link key={favorite.id} href={`/${contentPath}/${favorite.contentId}`}>
                <ContentCard $view={viewMode} hover>
                  <ContentImage $image={favorite.contentImage} $view={viewMode}>
                    <ContentOverlay>
                      <OverlayContent>
                        <PlayIcon onClick={(e) => {
                          e.preventDefault();
                          handlePlay(favorite.contentId);
                        }}>
                          <Play size={20} fill="currentColor" />
                        </PlayIcon>
                        <div style={{ flex: 1 }}>
                          <ContentTitle style={{ color: '#1a1a1a', marginBottom: '4px', fontSize: '16px' }}>
                            {favorite.contentTitle}
                          </ContentTitle>
                          <ContentMeta style={{ color: '#666', fontSize: '12px' }}>
                            <TypeIcon>
                              {favorite.contentType === 'MOVIE' ? <Film size={14} /> : <Tv size={14} />}
                              {favorite.contentType === 'MOVIE' ? '영화' : '시리즈'}
                            </TypeIcon>
                          </ContentMeta>
                        </div>
                      </OverlayContent>
                    </ContentOverlay>
                    
                    <RemoveButton 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(favorite.contentId, favorite.contentTitle);
                      }}
                      title="찜 목록에서 제거"
                    >
                      <Trash2 size={16} />
                    </RemoveButton>
                  </ContentImage>
                  <ContentInfo $view={viewMode}>
                    <ContentTitle>{favorite.contentTitle}</ContentTitle>
                    <ContentMeta>
                      <TypeIcon>
                        {favorite.contentType === 'MOVIE' ? <Film size={16} /> : <Tv size={16} />}
                        {favorite.contentType === 'MOVIE' ? '영화' : '시리즈'}
                      </TypeIcon>
                    </ContentMeta>
                    <AddedDate>
                      {new Date(favorite.createdAt).toLocaleDateString('ko-KR')}에 추가
                    </AddedDate>
                  </ContentInfo>
                </ContentCard>
              </Link>
            );
          })}
        </ContentGrid>
      </Content>
    </Container>
  );
}

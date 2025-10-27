'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Play, Plus, Download, Share2, Star, Clock, Calendar, ChevronLeft, Check, Heart } from 'lucide-react';
import Button from '../../../components/common/Button';
import VideoPlayer from '../../../components/VideoPlayer';
import { contentApi, favoriteApi, watchHistoryApi } from '../../../services/api';
import type { ContentDetail } from '../../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[900]};
`;

const HeroSection = styled.div<{ $image: string }>`
  position: relative;
  height: 70vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: white;
  width: 100%;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const PlayButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  height: auto;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  height: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FavoriteButton = styled(Button)<{ $isFavorite: boolean }>`
  background: ${({ $isFavorite }) => 
    $isFavorite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid ${({ $isFavorite }) => 
    $isFavorite ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'
  };
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  height: auto;

  &:hover {
    background: ${({ $isFavorite }) => 
      $isFavorite ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const InfoItem = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: white;
  }
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CastItem = styled.span`
  background: ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: white;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: white;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [initialWatchPosition, setInitialWatchPosition] = useState(0);

  // 사용자 정보 가져오기
  useEffect(() => {
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setUserId(userData.id);
      console.log('👤 로그인한 사용자 ID:', userData.id);
    }
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!params?.id) {
          setError('잘못된 영화 ID입니다.');
          return;
        }

        const id = parseInt(params.id as string);
        const response = await contentApi.getContentById(id);

        if (response.success && response.data) {
          setMovie(response.data);
          
          // 로그인한 경우 찜 여부 및 시청 기록 확인
          if (userId) {
            try {
              // 찜 여부 확인
              console.log('🔍 찜 여부 확인 중... userId:', userId, 'contentId:', id);
              const favoriteResponse = await favoriteApi.checkFavorite(userId, id);
              console.log('📊 찜 여부 응답:', favoriteResponse);
              if (favoriteResponse.success && favoriteResponse.data) {
                setIsFavorite(favoriteResponse.data.isFavorite || false);
              }
            } catch (err) {
              console.error('❌ 찜 여부 확인 실패:', err);
            }

            try {
              // 시청 기록 확인
              console.log('🔍 시청 기록 확인 중... userId:', userId, 'contentId:', id);
              const historyResponse = await watchHistoryApi.getWatchHistory(userId, id);
              console.log('📊 시청 기록 응답:', historyResponse);
              if (historyResponse.success && historyResponse.data) {
                setInitialWatchPosition(historyResponse.data.watchPosition);
                console.log('⏰ 이어보기 위치:', historyResponse.data.watchPosition, '초');
              }
            } catch (err) {
              console.error('❌ 시청 기록 확인 실패:', err);
            }
          }
        }
      } catch (err) {
        console.error('영화 조회 실패:', err);
        setError('영화 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params, userId]);

  const handlePlayMovie = () => {
    if (!movie?.videoUrl) {
      alert('죄송합니다. 현재 이 콘텐츠는 재생할 수 없습니다.');
      return;
    }

    // 이어보기 확인
    if (initialWatchPosition > 30) { // 30초 이상 시청한 경우
      const minutes = Math.floor(initialWatchPosition / 60);
      const seconds = Math.floor(initialWatchPosition % 60);
      const timeString = minutes > 0 
        ? `${minutes}분 ${seconds}초` 
        : `${seconds}초`;
      
      const shouldContinue = window.confirm(
        `이전에 시청한 기록이 있습니다.\n${timeString} 지점부터 이어서 시청하시겠습니까?\n\n확인: 이어보기 | 취소: 처음부터 시청`
      );
      
      if (!shouldContinue) {
        setInitialWatchPosition(0);
      }
    }
    
    setShowPlayer(true);
  };

  const handlePlayTrailer = () => {
    setShowTrailer(true);
  };

  // 시청 위치 저장 핸들러
  const handleTimeUpdate = async (position: number) => {
    if (!userId || !movie) return;

    try {
      await watchHistoryApi.updateWatchPosition(userId, movie.id, position);
    } catch (err) {
      console.error('시청 위치 저장 실패:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!movie || favoriteLoading) return;

    // 로그인 확인
    if (!userId) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        console.log('🗑️ 찜 제거 중... userId:', userId, 'contentId:', movie.id);
        const response = await favoriteApi.removeFavorite(userId, movie.id);
        console.log('📊 찜 제거 응답:', response);
        if (response.success) {
          setIsFavorite(false);
          alert('찜 목록에서 제거되었습니다.');
        }
      } else {
        console.log('❤️ 찜 추가 중... userId:', userId, 'contentId:', movie.id);
        const response = await favoriteApi.addFavorite(userId, movie.id);
        console.log('📊 찜 추가 응답:', response);
        if (response.success) {
          setIsFavorite(true);
          alert('찜 목록에 추가되었습니다.');
        }
      }
    } catch (err: any) {
      console.error('❌ 찜하기 처리 실패:', err);
      alert(err.message || '찜하기 처리에 실패했습니다.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <p>영화 정보를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  if (error || !movie) {
    return (
      <ErrorContainer>
        <p>{error || '영화를 찾을 수 없습니다.'}</p>
        <Button onClick={() => router.push('/movies')}>목록으로 돌아가기</Button>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      {/* 비디오 플레이어 */}
      {showPlayer && movie && movie.videoUrl && (
        <VideoPlayer
          src={movie.videoUrl}
          poster={movie.image}
          title={movie.title}
          onClose={() => setShowPlayer(false)}
          autoPlay
          contentId={movie.id}
          userId={userId || undefined}
          initialTime={initialWatchPosition}
          onTimeUpdate={handleTimeUpdate}
        />
      )}

      {/* 예고편 플레이어 */}
      {showTrailer && movie && movie.trailerUrl && (
        <VideoPlayer
          src={movie.trailerUrl}
          poster={movie.image}
          title={`${movie.title} - 예고편`}
          onClose={() => setShowTrailer(false)}
          autoPlay
        />
      )}

      <HeroSection $image={movie.image}>
        <HeroContent>
          <BackButton onClick={() => router.back()}>
            <ChevronLeft size={20} />
            뒤로가기
          </BackButton>
          
          <Title>{movie.title}</Title>
          
          <MetaInfo>
            <Rating>
              <Star size={24} fill="currentColor" />
              {movie.rating}
            </Rating>
            <MetaItem>
              <Calendar size={20} />
              {movie.year}
            </MetaItem>
            {movie.duration && (
              <MetaItem>
                <Clock size={20} />
                {movie.duration}
              </MetaItem>
            )}
            {movie.ageRating && (
              <MetaItem>
                {movie.ageRating}
              </MetaItem>
            )}
          </MetaInfo>
          
          <Description>{movie.description}</Description>
          
          <ActionButtons>
            <PlayButton onClick={handlePlayMovie}>
              <Play size={24} fill="currentColor" />
              재생
            </PlayButton>
            
            {movie.trailerUrl && (
              <SecondaryButton onClick={handlePlayTrailer}>
                <Play size={20} />
                예고편
              </SecondaryButton>
            )}
            
            <FavoriteButton 
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              $isFavorite={isFavorite}
            >
              {isFavorite ? (
                <>
                  <Check size={24} />
                  찜 완료
                </>
              ) : (
                <>
                  <Heart size={24} />
                  찜하기
                </>
              )}
            </FavoriteButton>
            
            <SecondaryButton>
              <Share2 size={24} />
              공유
            </SecondaryButton>
          </ActionButtons>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <SectionTitle>영화 정보</SectionTitle>
        
        <InfoGrid>
          <InfoItem>
            <h3>장르</h3>
            <p>{movie.genre}</p>
          </InfoItem>
          
          {movie.director && (
            <InfoItem>
              <h3>감독</h3>
              <p>{movie.director}</p>
            </InfoItem>
          )}
          
          {movie.country && (
            <InfoItem>
              <h3>제작 국가</h3>
              <p>{movie.country}</p>
            </InfoItem>
          )}
          
          {movie.language && (
            <InfoItem>
              <h3>언어</h3>
              <p>{movie.language}</p>
            </InfoItem>
          )}
        </InfoGrid>

        {movie.cast && movie.cast.length > 0 && (
          <>
            <SectionTitle>출연진</SectionTitle>
            <CastList>
              {movie.cast.map((actor, index) => (
                <CastItem key={index}>{actor}</CastItem>
              ))}
            </CastList>
          </>
        )}
      </ContentSection>
    </Container>
  );
}

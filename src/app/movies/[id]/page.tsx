'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Play, Plus, Download, Share2, Star, Clock, Calendar, ChevronLeft, Check, Heart } from 'lucide-react';
import Button from '../../../components/common/Button';
import VideoPlayer from '../../../components/VideoPlayer';
import { contentApi, favoriteApi } from '../../../services/api';
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
  
  // 임시 사용자 ID (실제로는 로그인 정보에서 가져와야 함)
  const TEMP_USER_ID = 1;

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
          
          // 찜 여부 확인
          try {
            const favoriteResponse = await favoriteApi.checkFavorite(TEMP_USER_ID, id);
            if (favoriteResponse.success && favoriteResponse.data) {
              setIsFavorite(favoriteResponse.data.isFavorite);
            }
          } catch (err) {
            console.log('찜 여부 확인 실패:', err);
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
  }, [params]);

  const handlePlayMovie = () => {
    setShowPlayer(true);
  };

  const handlePlayTrailer = () => {
    setShowTrailer(true);
  };

  const handleToggleFavorite = async () => {
    if (!movie || favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        const response = await favoriteApi.removeFavorite(TEMP_USER_ID, movie.id);
        if (response.success) {
          setIsFavorite(false);
          alert('찜 목록에서 제거되었습니다.');
        }
      } else {
        const response = await favoriteApi.addFavorite(TEMP_USER_ID, movie.id);
        if (response.success) {
          setIsFavorite(true);
          alert('찜 목록에 추가되었습니다.');
        }
      }
    } catch (err: any) {
      console.error('찜하기 처리 실패:', err);
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
      {showPlayer && movie && (
        <VideoPlayer
          src={movie.videoUrl || ''}
          poster={movie.image}
          title={movie.title}
          onClose={() => setShowPlayer(false)}
          autoPlay
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

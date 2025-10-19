'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { Play, Plus, Star, Clock, Calendar, Users, Award, Share2, Heart, Download } from 'lucide-react';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

// 임시 데이터
const movieData = {
  id: 1,
  title: '오징어 게임 2',
  originalTitle: 'Squid Game 2',
  description: '세계적인 화제를 불러일으킨 오징어 게임의 속편. 더욱 치열해진 생존 게임이 시작된다. 새로운 참가자들과 함께 더욱 복잡하고 위험한 게임들이 펼쳐지며, 이번에는 더 큰 상금과 더 치명적인 결과가 기다리고 있다.',
  genre: ['드라마', '스릴러', '액션'],
  year: 2024,
  rating: 9.2,
  duration: '60분',
  episodes: 8,
  director: '황동혁',
  cast: ['이정재', '박해수', '위하준', '정호연', '이유미'],
  country: '대한민국',
  language: '한국어',
  ageRating: '15+',
  image: '../오징어게임.jpg',
  poster: '../오징어게임.jpg',
  trailer: 'https://www.youtube.com/watch?v=example',
  isInWatchlist: false,
  isWatched: false,
  watchProgress: 0,
};

const similarContent = [
  {
    id: 1,
    title: '킹덤',
    genre: '액션',
    year: 2023,
    rating: 8.9,
    image: '../킹덤.jpg',
  },
  {
    id: 2,
    title: '지옥',
    genre: '공포',
    year: 2023,
    rating: 8.5,
    image: '../지옥.jpg',
  },
  {
    id: 3,
    title: '마이 네임',
    genre: '액션',
    year: 2023,
    rating: 8.7,
    image: '../마이네임.jpg',
  },
];

const DetailContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const HeroSection = styled.section`
  position: relative;
  height: 70vh;
  min-height: 500px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.primary[600]} 50%,
    ${({ theme }) => theme.colors.primary[700]} 100%
  );
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const HeroBackground = styled.div<{ $image: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 1;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  z-index: 2;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.white};
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const HeroInfo = styled.div`
  flex: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const HeroSubtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  opacity: 0.9;
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const GenreTags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

const GenreTag = styled.span`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  background-color: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const PlayButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  height: auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    transform: scale(1.05);
  }
`;

const ActionButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  height: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const PosterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
  }
`;

const Poster = styled.div<{ $image: string }>`
  width: 250px;
  height: 375px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 200px;
    height: 300px;
  }
`;

const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  margin-bottom: ${({ theme }) => theme.spacing[16]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const InfoSection = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const InfoList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[600]};
  min-width: 100px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CastItem = styled.span`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SimilarSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[16]};
`;

const SimilarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const SimilarCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const SimilarImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 300px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 225px;
  }
`;

const SimilarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const SimilarTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SimilarMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning};
`;

export default function MovieDetail() {
  const params = useParams();
  const [isInWatchlist, setIsInWatchlist] = useState(movieData.isInWatchlist);
  const [isWatched, setIsWatched] = useState(movieData.isWatched);

  const handlePlay = () => {
    console.log('재생 시작');
  };

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    console.log('찜 목록에 추가/제거');
  };

  const handleShare = () => {
    console.log('공유');
  };

  const handleDownload = () => {
    console.log('다운로드');
  };

  return (
    <DetailContainer>
      <HeroSection>
        <HeroBackground $image={movieData.image} />
        <HeroOverlay />
        <HeroContent>
          <HeroInfo>
            <HeroTitle>{movieData.title}</HeroTitle>
            <HeroSubtitle>{movieData.originalTitle}</HeroSubtitle>
            <HeroDescription>{movieData.description}</HeroDescription>
            
            <GenreTags>
              {movieData.genre.map((genre, index) => (
                <GenreTag key={index}>{genre}</GenreTag>
              ))}
            </GenreTags>

            <HeroMeta>
              <MetaItem>
                <Star size={20} fill="currentColor" />
                {movieData.rating}
              </MetaItem>
              <MetaItem>
                <Clock size={20} />
                {movieData.duration}
              </MetaItem>
              <MetaItem>
                <Calendar size={20} />
                {movieData.year}
              </MetaItem>
              <MetaItem>
                <Award size={20} />
                {movieData.ageRating}
              </MetaItem>
            </HeroMeta>

            <HeroActions>
              <PlayButton onClick={handlePlay}>
                <Play size={24} fill="currentColor" />
                재생
              </PlayButton>
              <ActionButton onClick={handleAddToWatchlist}>
                <Plus size={24} />
                {isInWatchlist ? '찜한 목록에서 제거' : '찜하기'}
              </ActionButton>
              <ActionButton onClick={handleShare}>
                <Share2 size={24} />
                공유
              </ActionButton>
              <ActionButton onClick={handleDownload}>
                <Download size={24} />
                다운로드
              </ActionButton>
            </HeroActions>
          </HeroInfo>

          <PosterContainer>
            <Poster $image={movieData.poster} />
          </PosterContainer>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <Container>
          <InfoGrid>
            <InfoSection>
              <SectionTitle>상세 정보</SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoLabel>감독</InfoLabel>
                  <InfoValue>{movieData.director}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>출연진</InfoLabel>
                  <CastList>
                    {movieData.cast.map((actor, index) => (
                      <CastItem key={index}>{actor}</CastItem>
                    ))}
                  </CastList>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>제작국가</InfoLabel>
                  <InfoValue>{movieData.country}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>언어</InfoLabel>
                  <InfoValue>{movieData.language}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>에피소드</InfoLabel>
                  <InfoValue>{movieData.episodes}화</InfoValue>
                </InfoItem>
              </InfoList>
            </InfoSection>

            <InfoSection>
              <SectionTitle>시청 정보</SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoLabel>시청 상태</InfoLabel>
                  <InfoValue>{isWatched ? '시청 완료' : '미시청'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>진행률</InfoLabel>
                  <InfoValue>{movieData.watchProgress}%</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>찜한 목록</InfoLabel>
                  <InfoValue>{isInWatchlist ? '추가됨' : '미추가'}</InfoValue>
                </InfoItem>
              </InfoList>
            </InfoSection>
          </InfoGrid>

          <SimilarSection>
            <SectionTitle>비슷한 콘텐츠</SectionTitle>
            <SimilarGrid>
              {similarContent.map((content) => (
                <SimilarCard key={content.id} hover>
                  <SimilarImage $image={content.image} />
                  <SimilarInfo>
                    <SimilarTitle>{content.title}</SimilarTitle>
                    <SimilarMeta>
                      <Rating>
                        <Star size={16} fill="currentColor" />
                        {content.rating}
                      </Rating>
                      <span>{content.year}</span>
                      <span>{content.genre}</span>
                    </SimilarMeta>
                  </SimilarInfo>
                </SimilarCard>
              ))}
            </SimilarGrid>
          </SimilarSection>
        </Container>
      </ContentSection>
    </DetailContainer>
  );
}

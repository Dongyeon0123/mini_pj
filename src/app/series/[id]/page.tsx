'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Play, Plus, Download, Share2, Star, Clock, Calendar, Tv, ChevronLeft } from 'lucide-react';
import Button from '../../../components/common/Button';
import { contentApi } from '../../../services/api';
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

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [series, setSeries] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!params?.id) {
          setError('잘못된 시리즈 ID입니다.');
          return;
        }

        const id = parseInt(params.id as string);
        const response = await contentApi.getContentById(id);

        if (response.success && response.data) {
          setSeries(response.data);
        }
      } catch (err) {
        console.error('시리즈 조회 실패:', err);
        setError('시리즈 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [params]);

  if (loading) {
    return (
      <LoadingContainer>
        <p>시리즈 정보를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  if (error || !series) {
    return (
      <ErrorContainer>
        <p>{error || '시리즈를 찾을 수 없습니다.'}</p>
        <Button onClick={() => router.push('/series')}>목록으로 돌아가기</Button>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <HeroSection $image={series.image}>
        <HeroContent>
          <BackButton onClick={() => router.back()}>
            <ChevronLeft size={20} />
            뒤로가기
          </BackButton>
          
          <Title>{series.title}</Title>
          
          <MetaInfo>
            <Rating>
              <Star size={24} fill="currentColor" />
              {series.rating}
            </Rating>
            <MetaItem>
              <Calendar size={20} />
              {series.year}
            </MetaItem>
            {series.seasons && series.episodes && (
              <MetaItem>
                <Tv size={20} />
                {series.seasons}시즌 · {series.episodes}화
              </MetaItem>
            )}
            {series.ageRating && (
              <MetaItem>
                {series.ageRating}
              </MetaItem>
            )}
          </MetaInfo>
          
          <Description>{series.description}</Description>
          
          <ActionButtons>
            <PlayButton>
              <Play size={24} fill="currentColor" />
              재생
            </PlayButton>
            <SecondaryButton>
              <Plus size={24} />
              찜하기
            </SecondaryButton>
            <SecondaryButton>
              <Download size={24} />
              다운로드
            </SecondaryButton>
            <SecondaryButton>
              <Share2 size={24} />
              공유
            </SecondaryButton>
          </ActionButtons>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <SectionTitle>시리즈 정보</SectionTitle>
        
        <InfoGrid>
          <InfoItem>
            <h3>장르</h3>
            <p>{series.genre}</p>
          </InfoItem>
          
          {series.director && (
            <InfoItem>
              <h3>감독</h3>
              <p>{series.director}</p>
            </InfoItem>
          )}
          
          {series.country && (
            <InfoItem>
              <h3>제작 국가</h3>
              <p>{series.country}</p>
            </InfoItem>
          )}
          
          {series.language && (
            <InfoItem>
              <h3>언어</h3>
              <p>{series.language}</p>
            </InfoItem>
          )}
        </InfoGrid>

        {series.cast && series.cast.length > 0 && (
          <>
            <SectionTitle>출연진</SectionTitle>
            <CastList>
              {series.cast.map((actor, index) => (
                <CastItem key={index}>{actor}</CastItem>
              ))}
            </CastList>
          </>
        )}
      </ContentSection>
    </Container>
  );
}


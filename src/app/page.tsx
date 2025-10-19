'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Play, Plus, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// 임시 데이터
const featuredContent = {
  id: 1,
  title: '오징어 게임 2',
  description: '세계적인 화제를 불러일으킨 오징어 게임의 속편. 더욱 치열해진 생존 게임이 시작된다.',
  genre: '드라마',
  year: 2024,
  rating: 9.2,
  duration: '60분',
  image: '/오징어게임.jpg',
  trailer: 'https://www.youtube.com/watch?v=example',
};

const recommendedContent = [
  {
    id: 1,
    title: '킹덤',
    genre: '액션',
    year: 2023,
    rating: 8.9,
    image: '/킹덤.jpg',
  },
  {
    id: 2,
    title: '지옥',
    genre: '공포',
    year: 2023,
    rating: 8.5,
    image: '/지옥.jpg',
  },
  {
    id: 3,
    title: '마이 네임',
    genre: '액션',
    year: 2023,
    rating: 8.7,
    image: '/마이네임.jpg',
  },
  {
    id: 4,
    title: '더 글로리',
    genre: '드라마',
    year: 2023,
    rating: 8.8,
    image: '/더글로리.jpg',
  },
  {
    id: 5,
    title: '오징어 게임',
    genre: '드라마',
    year: 2021,
    rating: 9.2,
    image: '/오징어게임.jpg',
  },
];

const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  min-height: 600px;
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
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
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

const AddButton = styled(Button)`
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

const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ContentCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

const ContentImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 320px;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 40%,
      rgba(0, 0, 0, 0.1) 100%
    );
    transition: opacity 0.3s ease;
  }

  ${ContentCard}:hover &::after {
    opacity: 0.8;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 240px;
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.gray[50]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
  }
`;

const ContentInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[800]};
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.gray[25]} 100%);
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
  position: relative;
  z-index: 2;
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
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning};
`;

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // 실제로는 비디오 플레이어를 열거나 재생을 시작
    console.log('재생 시작');
  };

  const handleAddToList = () => {
    // 실제로는 찜 목록에 추가
    console.log('찜 목록에 추가');
  };

  return (
    <>
      <HeroSection>
        <HeroBackground $image={featuredContent.image} />
        <HeroOverlay />
        <HeroContent>
          <HeroTitle>{featuredContent.title}</HeroTitle>
          <HeroDescription>{featuredContent.description}</HeroDescription>
          <HeroMeta>
            <MetaItem>
              <Star size={20} fill="currentColor" />
              {featuredContent.rating}
            </MetaItem>
            <MetaItem>
              <Clock size={20} />
              {featuredContent.duration}
            </MetaItem>
            <MetaItem>{featuredContent.year}</MetaItem>
            <MetaItem>{featuredContent.genre}</MetaItem>
          </HeroMeta>
          <HeroActions>
            <Link href="/movies/1">
              <PlayButton>
                <Play size={24} fill="currentColor" />
                재생
              </PlayButton>
            </Link>
            <AddButton onClick={handleAddToList}>
              <Plus size={24} />
              찜하기
            </AddButton>
          </HeroActions>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <Container>
          <SectionTitle>추천 콘텐츠</SectionTitle>
          <ContentGrid>
            {recommendedContent.map((content) => (
              <ContentCard key={content.id} hover>
                <ContentImage $image={content.image}>
                  <ContentOverlay>
                    <OverlayContent>
                      <PlayIcon onClick={handlePlay}>
                        <Play size={20} fill="currentColor" />
                      </PlayIcon>
                      <div style={{ flex: 1 }}>
                        <ContentTitle style={{ color: '#1a1a1a', marginBottom: '4px', fontSize: '16px' }}>
                          {content.title}
                        </ContentTitle>
                        <ContentMeta style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <Rating>
                            <Star size={14} fill="currentColor" />
                            {content.rating}
                          </Rating>
                          <span>{content.year}</span>
                        </ContentMeta>
                        <div style={{ color: '#666', fontSize: '11px' }}>
                          {content.genre}
                        </div>
                      </div>
                    </OverlayContent>
                  </ContentOverlay>
                </ContentImage>
                <ContentInfo>
                  <ContentTitle>{content.title}</ContentTitle>
                  <ContentMeta>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      {content.rating}
                    </Rating>
                    <span>{content.year}</span>
                    <span>{content.genre}</span>
                  </ContentMeta>
                </ContentInfo>
              </ContentCard>
            ))}
          </ContentGrid>
        </Container>
      </ContentSection>
    </>
  );
}
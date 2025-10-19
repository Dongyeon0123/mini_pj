'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Play, Plus, Star, Heart, Trash2, Grid, List, Film, Tv } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

// 임시 데이터
const favoriteContent = [
  {
    id: 1,
    title: '오징어 게임 2',
    type: 'movie',
    genre: '드라마',
    year: 2024,
    rating: 9.2,
    duration: '60분',
    image: './오징어게임.jpg',
    addedDate: '2024-01-15',
  },
  {
    id: 2,
    title: '킹덤',
    type: 'series',
    genre: '액션',
    year: 2023,
    rating: 8.9,
    episodes: 12,
    seasons: 2,
    image: '/킹덤.jpg',
    addedDate: '2024-01-10',
  },
  {
    id: 3,
    title: '지옥',
    type: 'movie',
    genre: '공포',
    year: 2023,
    rating: 8.5,
    duration: '50분',
    image: './지옥.jpg',
    addedDate: '2024-01-08',
  },
  {
    id: 4,
    title: '마이 네임',
    type: 'series',
    genre: '액션',
    year: 2023,
    rating: 8.7,
    episodes: 8,
    seasons: 1,
    image: './마이네임.jpg',
    addedDate: '2024-01-05',
  },
  {
    id: 5,
    title: '스위트홈',
    type: 'series',
    genre: '공포',
    year: 2023,
    rating: 8.3,
    episodes: 10,
    seasons: 1,
    image: './스위트홈.jpg',
    addedDate: '2024-01-03',
  },
  {
    id: 6,
    title: '더 글로리',
    type: 'series',
    genre: '드라마',
    year: 2023,
    rating: 8.8,
    episodes: 8,
    seasons: 1,
    image: './더글로리.jpg',
    addedDate: '2024-01-01',
  },
];

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
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;

  ${ContentCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    transform: scale(1.1);
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

export default function FavoritesPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContent = favoriteContent.filter(content => {
    if (selectedType === 'all') return true;
    return content.type === selectedType;
  });

  const movieCount = favoriteContent.filter(content => content.type === 'movie').length;
  const seriesCount = favoriteContent.filter(content => content.type === 'series').length;

  const handlePlay = (contentId: number) => {
    console.log('재생 시작:', contentId);
  };

  const handleRemove = (contentId: number) => {
    console.log('찜 목록에서 제거:', contentId);
  };

  if (favoriteContent.length === 0) {
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
            <Button size="lg">
              콘텐츠 둘러보기
            </Button>
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
              <StatNumber>{favoriteContent.length}</StatNumber>
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
                $active={selectedType === 'movie'}
                onClick={() => setSelectedType('movie')}
              >
                <Film size={16} />
                영화
              </TypeButton>
              <TypeButton
                $active={selectedType === 'series'}
                onClick={() => setSelectedType('series')}
              >
                <Tv size={16} />
                시리즈
              </TypeButton>
            </TypeFilter>
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
          {filteredContent.map((content) => (
            <Link key={content.id} href={`/${content.type}s/${content.id}`}>
              <ContentCard $view={viewMode} hover>
                <ContentImage $image={content.image} $view={viewMode}>
                  <ContentOverlay>
                    <OverlayContent>
                      <PlayIcon onClick={(e) => {
                        e.preventDefault();
                        handlePlay(content.id);
                      }}>
                        <Play size={20} fill="currentColor" />
                      </PlayIcon>
                      <div style={{ flex: 1 }}>
                        <ContentTitle style={{ color: '#1a1a1a', marginBottom: '4px', fontSize: '16px' }}>
                          {content.title}
                        </ContentTitle>
                        <ContentMeta style={{ color: '#666', fontSize: '12px' }}>
                          <Rating>
                            <Star size={14} fill="currentColor" />
                            {content.rating}
                          </Rating>
                          <span>{content.year}</span>
                          <span>{content.genre}</span>
                        </ContentMeta>
                      </div>
                    </OverlayContent>
                  </ContentOverlay>
                  
                  <RemoveButton onClick={(e) => {
                    e.preventDefault();
                    handleRemove(content.id);
                  }}>
                    <Trash2 size={16} />
                  </RemoveButton>
                </ContentImage>
                <ContentInfo $view={viewMode}>
                  <ContentTitle>{content.title}</ContentTitle>
                  <ContentMeta>
                    <TypeIcon>
                      {content.type === 'movie' ? <Film size={16} /> : <Tv size={16} />}
                      {content.type === 'movie' ? '영화' : '시리즈'}
                    </TypeIcon>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      {content.rating}
                    </Rating>
                    <span>{content.year}</span>
                    <span>{content.genre}</span>
                    {content.type === 'movie' ? (
                      <span>{content.duration}</span>
                    ) : (
                      <span>{content.seasons}시즌 {content.episodes}화</span>
                    )}
                  </ContentMeta>
                  <AddedDate>
                    {new Date(content.addedDate).toLocaleDateString('ko-KR')}에 추가
                  </AddedDate>
                </ContentInfo>
              </ContentCard>
            </Link>
          ))}
        </ContentGrid>
      </Content>
    </Container>
  );
}

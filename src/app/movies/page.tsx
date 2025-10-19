'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Play, Plus, Star, Filter, Search, Grid, List } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

// 임시 데이터
const movies = [
  {
    id: 1,
    title: '오징어 게임 2',
    genre: '드라마',
    year: 2024,
    rating: 9.2,
    duration: '60분',
    image: '/오징어게임.jpg',
  },
  {
    id: 2,
    title: '킹덤',
    genre: '액션',
    year: 2023,
    rating: 8.9,
    duration: '45분',
    image: '/킹덤.jpg',
  },
  {
    id: 3,
    title: '지옥',
    genre: '공포',
    year: 2023,
    rating: 8.5,
    duration: '50분',
    image: '/지옥.jpg',
  },
  {
    id: 4,
    title: '마이 네임',
    genre: '액션',
    year: 2023,
    rating: 8.7,
    duration: '55분',
    image: '/마이네임.jpg',
  },
  {
    id: 5,
    title: '더 글로리',
    genre: '드라마',
    year: 2023,
    rating: 8.8,
    duration: '50분',
    image: '/더글로리.jpg',
  },
  {
    id: 6,
    title: 'D.P.',
    genre: '드라마',
    year: 2023,
    rating: 8.6,
    duration: '45분',
    image: '/DP.jpg',
  },
  {
    id: 7,
    title: '지금 우리 학교는',
    genre: '코미디',
    year: 2021,
    rating: 8.4,
    duration: '50분',
    image: '/지우학.jpg',
  },
];

const genres = ['전체', '드라마', '액션', '공포', '코미디', '로맨스', '스릴러'];

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

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto;
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

const GenreFilter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

const GenreButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background: ${({ $active, theme }) => 
    $active 
      ? `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`
      : `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.gray[50]} 100%)`
  };
  color: ${({ $active, theme }) => 
    $active ? theme.colors.white : theme.colors.gray[700]
  };
  border: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : theme.colors.gray[200]
  };
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $active, theme }) => 
    $active 
      ? `0 4px 12px ${theme.colors.primary[200]}`
      : `0 2px 4px rgba(0, 0, 0, 0.05)`
  };
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: ${({ $active, theme }) => 
      $active 
        ? `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`
        : `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 100%)`
    };
    transform: translateY(-2px);
    box-shadow: ${({ $active, theme }) => 
      $active 
        ? `0 8px 25px ${theme.colors.primary[300]}`
        : `0 4px 12px rgba(0, 0, 0, 0.1)`
    };

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
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

const MoviesGrid = styled.div<{ $view: 'grid' | 'list' }>`
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

const MovieCard = styled(Card)<{ $view: 'grid' | 'list' }>`
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

const MovieImage = styled.div<{ $image: string; $view: 'grid' | 'list' }>`
  width: ${({ $view }) => $view === 'list' ? '200px' : '100%'};
  height: ${({ $view }) => $view === 'list' ? '120px' : '320px'};
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;
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

  ${MovieCard}:hover &::after {
    opacity: 0.8;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: ${({ $view }) => $view === 'list' ? '100px' : '240px'};
  }
`;

const MovieOverlay = styled.div`
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

  ${MovieCard}:hover & {
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
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.gray[50]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-right: ${({ theme }) => theme.spacing[4]};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
  }
`;

const MovieInfo = styled.div<{ $view: 'grid' | 'list' }>`
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[800]};
  flex: 1;
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.gray[25]} 100%);
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
  position: relative;
  z-index: 2;
`;

const MovieTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieMeta = styled.div`
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[12]};
`;

const PageButton = styled.button<{ $active?: boolean }>`
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
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : theme.colors.gray[50]
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === '전체' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handlePlay = (movieId: number) => {
    console.log('재생 시작:', movieId);
  };

  const handleAddToWatchlist = (movieId: number) => {
    console.log('찜 목록에 추가:', movieId);
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderTitle>영화</HeaderTitle>
          <HeaderSubtitle>다양한 장르의 최신 영화를 만나보세요</HeaderSubtitle>
          <SearchSection>
            <Input
              type="text"
              placeholder="영화 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchSection>
        </HeaderContent>
      </Header>

      <Content>
        <FilterSection>
          <FilterGroup>
            <GenreFilter>
              {genres.map((genre) => (
                <GenreButton
                  key={genre}
                  $active={selectedGenre === genre}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </GenreButton>
              ))}
            </GenreFilter>
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

        <MoviesGrid $view={viewMode}>
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <MovieCard $view={viewMode} hover>
                <MovieImage $image={movie.image} $view={viewMode}>
                  <MovieOverlay>
                    <OverlayContent>
                      <PlayIcon onClick={(e) => {
                        e.preventDefault();
                        handlePlay(movie.id);
                      }}>
                        <Play size={20} fill="currentColor" />
                      </PlayIcon>
                      <div style={{ flex: 1 }}>
                        <MovieTitle style={{ color: '#1a1a1a', marginBottom: '4px', fontSize: '16px' }}>
                          {movie.title}
                        </MovieTitle>
                        <MovieMeta style={{ color: '#666', fontSize: '12px' }}>
                          <Rating>
                            <Star size={14} fill="currentColor" />
                            {movie.rating}
                          </Rating>
                          <span>{movie.year}</span>
                          <span>{movie.genre}</span>
                        </MovieMeta>
                      </div>
                    </OverlayContent>
                  </MovieOverlay>
                </MovieImage>
                <MovieInfo $view={viewMode}>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieMeta>
                    <Rating>
                      <Star size={16} fill="currentColor" />
                      {movie.rating}
                    </Rating>
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                    <span>{movie.duration}</span>
                  </MovieMeta>
                </MovieInfo>
              </MovieCard>
            </Link>
          ))}
        </MoviesGrid>

        <Pagination>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            이전
          </PageButton>
          <PageButton $active={currentPage === 1} onClick={() => setCurrentPage(1)}>
            1
          </PageButton>
          <PageButton $active={currentPage === 2} onClick={() => setCurrentPage(2)}>
            2
          </PageButton>
          <PageButton $active={currentPage === 3} onClick={() => setCurrentPage(3)}>
            3
          </PageButton>
          <PageButton
            disabled={currentPage === 3}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
          </PageButton>
        </Pagination>
      </Content>
    </Container>
  );
}

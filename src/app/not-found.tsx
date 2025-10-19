'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const NotFoundCard = styled(Card)`
  max-width: 600px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[10]};
`;

const NotFoundIcon = styled.div`
  width: 6rem;
  height: 6rem;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const NotFoundCode = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['6xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  line-height: 1;
`;

const NotFoundTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NotFoundMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default function NotFound() {
  return (
    <NotFoundContainer>
      <NotFoundCard>
        <NotFoundIcon>
          <Search size={40} />
        </NotFoundIcon>
        <NotFoundCode>404</NotFoundCode>
        <NotFoundTitle>페이지를 찾을 수 없습니다</NotFoundTitle>
        <NotFoundMessage>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 확인하시거나 홈페이지로 돌아가주세요.
        </NotFoundMessage>
        <ButtonGroup>
          <StyledLink href="/">
            <Button variant="primary">
              <Home size={20} />
              홈으로
            </Button>
          </StyledLink>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
          >
            <ArrowLeft size={20} />
            이전 페이지
          </Button>
        </ButtonGroup>
      </NotFoundCard>
    </NotFoundContainer>
  );
}

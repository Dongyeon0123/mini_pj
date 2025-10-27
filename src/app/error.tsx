'use client';

import React from 'react';
import styled from 'styled-components';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ErrorCard = styled(Card)`
  max-width: 500px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[10]};
`;

const ErrorIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: ${({ theme }) => theme.colors.error}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
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

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <ErrorContainer>
      <ErrorCard>
        <ErrorIcon>
          <AlertCircle size={32} />
        </ErrorIcon>
        <ErrorTitle>오류가 발생했습니다</ErrorTitle>
        <ErrorMessage>
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
        </ErrorMessage>
        <ButtonGroup>
          <Button onClick={reset} variant="primary">
            <RefreshCw size={20} />
            다시 시도
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
          >
            <Home size={20} />
            홈으로
          </Button>
        </ButtonGroup>
      </ErrorCard>
    </ErrorContainer>
  );
}


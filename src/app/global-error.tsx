'use client';

import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const GlobalErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const GlobalErrorCard = styled(Card)`
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

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <GlobalErrorContainer>
          <GlobalErrorCard>
            <ErrorIcon>
              <AlertTriangle size={32} />
            </ErrorIcon>
            <ErrorTitle>심각한 오류가 발생했습니다</ErrorTitle>
            <ErrorMessage>
              애플리케이션에서 예상치 못한 오류가 발생했습니다.
              <br />
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
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
          </GlobalErrorCard>
        </GlobalErrorContainer>
      </body>
    </html>
  );
}



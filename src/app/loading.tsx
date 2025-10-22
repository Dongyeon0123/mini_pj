'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const LoadingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[10]};
  box-shadow: ${({ theme }) => theme.shadows.base};
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
`;

const LoadingTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export default function Loading() {
  return (
    <LoadingContainer>
      <LoadingCard>
        <LoadingSpinner />
        <LoadingTitle>로딩 중...</LoadingTitle>
        <LoadingMessage>
          페이지를 불러오고 있습니다.
          <br />
          잠시만 기다려주세요.
        </LoadingMessage>
        <LoadingDots>
          <Dot $delay={0} />
          <Dot $delay={0.2} />
          <Dot $delay={0.4} />
        </LoadingDots>
      </LoadingCard>
    </LoadingContainer>
  );
}


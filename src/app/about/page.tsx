'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowLeft, Code, Palette, Smartphone, Zap, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[16]};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[500]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[600]};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[16]};
`;

const InfoCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.white};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TechList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TechItem = styled.li`
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: '🚀';
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

const CTA = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[12]};
`;

export default function About() {
  return (
    <Container>
      <Content>
        <Header>
          <BackButton href="/">
            <ArrowLeft size={20} />
            홈으로 돌아가기
          </BackButton>
          <Title>U+ OTT 플랫폼</Title>
          <Subtitle>
            LG U+ 시그니처 디자인의 프리미엄 OTT 서비스로 
            최고의 엔터테인먼트 경험을 제공합니다.
          </Subtitle>
        </Header>

        <Grid>
          <InfoCard>
            <IconWrapper>
              <Code size={24} />
            </IconWrapper>
            <CardTitle>기술 스택</CardTitle>
            <CardDescription>
              최신 웹 기술을 활용하여 안정적이고 빠른 서비스를 제공합니다.
            </CardDescription>
            <TechList>
              <TechItem>Next.js 15.5.6</TechItem>
              <TechItem>React 19.1.0</TechItem>
              <TechItem>TypeScript 5</TechItem>
              <TechItem>Styled Components</TechItem>
              <TechItem>Lucide React Icons</TechItem>
            </TechList>
          </InfoCard>

          <InfoCard>
            <IconWrapper>
              <Palette size={24} />
            </IconWrapper>
            <CardTitle>디자인 시스템</CardTitle>
            <CardDescription>
              일관된 디자인 언어로 사용자 경험을 향상시킵니다.
            </CardDescription>
            <FeatureList>
              <FeatureItem>LG U+ 시그니처 디자인</FeatureItem>
              <FeatureItem>반응형 웹 디자인</FeatureItem>
              <FeatureItem>다크/라이트 모드 지원</FeatureItem>
              <FeatureItem>접근성 고려</FeatureItem>
            </FeatureList>
          </InfoCard>

          <InfoCard>
            <IconWrapper>
              <Smartphone size={24} />
            </IconWrapper>
            <CardTitle>주요 기능</CardTitle>
            <CardDescription>
              다양한 디바이스에서 최적화된 경험을 제공합니다.
            </CardDescription>
            <FeatureList>
              <FeatureItem>영화 및 시리즈 스트리밍</FeatureItem>
              <FeatureItem>개인화된 추천 시스템</FeatureItem>
              <FeatureItem>찜 목록 및 시청 기록</FeatureItem>
              <FeatureItem>관리자 대시보드</FeatureItem>
            </FeatureList>
          </InfoCard>

          <InfoCard>
            <IconWrapper>
              <Shield size={24} />
            </IconWrapper>
            <CardTitle>보안 및 성능</CardTitle>
            <CardDescription>
              안전하고 빠른 서비스를 위한 최적화된 구조입니다.
            </CardDescription>
            <FeatureList>
              <FeatureItem>TypeScript 타입 안정성</FeatureItem>
              <FeatureItem>SEO 최적화</FeatureItem>
              <FeatureItem>빠른 로딩 속도</FeatureItem>
              <FeatureItem>에러 처리 시스템</FeatureItem>
            </FeatureList>
          </InfoCard>
        </Grid>

        <CTA>
          <Button as={Link} href="/" size="lg">
            <Zap size={20} />
            서비스 체험하기
          </Button>
        </CTA>
      </Content>
    </Container>
  );
}

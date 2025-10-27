'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';
import { authApi, SignupRequest } from '../../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.3)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(233, 30, 99, 0.1) 0%, transparent 50%);
    animation: float 15s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-30px, 30px) rotate(180deg); }
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[6]};
  left: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: ${({ theme }) => theme.spacing[4]};
    left: ${({ theme }) => theme.spacing[4]};
  }
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing[10]};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: inherit;
    z-index: -1;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const LogoIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 50%, ${({ theme }) => theme.colors.primary[700]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[500]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};
  text-align: center;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.primary[400]};
  z-index: 1;
  transition: color 0.2s ease;
`;

const StyledInput = styled(Input)`
  input {
    padding-left: ${({ theme }) => theme.spacing[12]};
    padding-right: ${({ theme }) => theme.spacing[12]};
    height: 3.5rem;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    border: 2px solid ${({ theme }) => theme.colors.gray[200]};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary[500]};
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primary[100]};
      transform: translateY(-2px);
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary[300]};
      background: rgba(255, 255, 255, 0.9);
    }
  }

  &:focus-within ${InputIcon} {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const StrengthBar = styled.div`
  height: 0.25rem;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StrengthFill = styled.div<{ $strength: number }>`
  height: 100%;
  width: ${({ $strength }) => $strength}%;
  background-color: ${({ $strength, theme }) => {
    if ($strength < 25) return theme.colors.error;
    if ($strength < 50) return theme.colors.warning;
    if ($strength < 75) return theme.colors.info;
    return theme.colors.success;
  }};
  transition: all 0.3s ease;
`;

const StrengthText = styled.div<{ $strength: number }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $strength, theme }) => {
    if ($strength < 25) return theme.colors.error;
    if ($strength < 50) return theme.colors.warning;
    if ($strength < 75) return theme.colors.info;
    return theme.colors.success;
  }};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const PasswordRequirements = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const RequirementItem = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $met, theme }) => $met ? theme.colors.success : theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: ${({ theme }) => theme.colors.primary[500]};
  cursor: pointer;
  margin-top: 0.125rem;
  flex-shrink: 0;
`;

const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[500]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SignupButton = styled(Button)`
  width: 100%;
  height: 3.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[700]} 100%);
  }

  &:active {
    transform: translateY(0);
  }

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

  &:hover::before {
    left: 100%;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const LoginButton = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[500]};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-left: ${({ theme }) => theme.spacing[2]};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.error}40;
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.success}40;
`;

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
};

const getPasswordStrengthText = (strength: number): string => {
  if (strength < 25) return '매우 약함';
  if (strength < 50) return '약함';
  if (strength < 75) return '보통';
  return '강함';
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordRequirements = [
    { text: '8자 이상', met: formData.password.length >= 8 },
    { text: '소문자 포함', met: /[a-z]/.test(formData.password) },
    { text: '대문자 포함', met: /[A-Z]/.test(formData.password) },
    { text: '숫자 포함', met: /[0-9]/.test(formData.password) },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('이용약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // API 호출을 위한 데이터 준비
      const signupData: SignupRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.firstName + (formData.lastName ? ` ${formData.lastName}` : ''),
        phoneNumber: formData.phoneNumber || undefined,
      };

      console.log('회원가입 API 호출:', signupData);
      
      // 백엔드 API 호출
      const response = await authApi.signup(signupData);
      
      if (response.success) {
        setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        
        // 2초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
      
    } catch (error: any) {
      console.error('회원가입 API 에러:', error);
      setError(error.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackButton href="/">
        <ArrowLeft size={20} />
        홈으로 돌아가기
      </BackButton>

      <SignupCard>
        <Logo>
          <LogoIcon>U+</LogoIcon>
          <Title>회원가입</Title>
          <Subtitle>U+ OTT와 함께하세요</Subtitle>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <InputRow>
            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <StyledInput
                type="text"
                name="firstName"
                placeholder="이름"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <StyledInput
                type="text"
                name="lastName"
                placeholder="성"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
          </InputRow>

          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <StyledInput
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <StyledInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
            
            {formData.password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill $strength={passwordStrength} />
                </StrengthBar>
                <StrengthText $strength={passwordStrength}>
                  비밀번호 강도: {getPasswordStrengthText(passwordStrength)}
                </StrengthText>
                <PasswordRequirements>
                  {passwordRequirements.map((req, index) => (
                    <RequirementItem key={index} $met={req.met}>
                      <Check size={16} />
                      {req.text}
                    </RequirementItem>
                  ))}
                </PasswordRequirements>
              </PasswordStrength>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <StyledInput
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <span>
              <TermsLink href="/terms" target="_blank">이용약관</TermsLink> 및{' '}
              <TermsLink href="/privacy" target="_blank">개인정보처리방침</TermsLink>에 동의합니다.
            </span>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              name="agreeToMarketing"
              checked={formData.agreeToMarketing}
              onChange={handleInputChange}
            />
            <span>
              마케팅 정보 수신에 동의합니다. (선택)
            </span>
          </CheckboxContainer>

          <SignupButton type="submit" disabled={isLoading}>
            {isLoading ? '회원가입 중...' : '회원가입'}
          </SignupButton>
        </Form>

        <LoginLink>
          이미 계정이 있으신가요?
          <LoginButton href="/auth/login">로그인</LoginButton>
        </LoginLink>
      </SignupCard>
    </Container>
  );
}

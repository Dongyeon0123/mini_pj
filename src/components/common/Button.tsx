import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  as?: React.ElementType;
  href?: string;
  loading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.fontWeights.semibold};
  border-radius: ${theme.borderRadius.xl};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  gap: ${theme.spacing[2]};
  white-space: nowrap;
  user-select: none;

  /* 기본 애니메이션 효과 */
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

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[5]};
          font-size: ${theme.fontSizes.sm};
          height: 2.25rem;
          border-radius: ${theme.borderRadius.lg};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[5]} ${theme.spacing[10]};
          font-size: ${theme.fontSizes.xl};
          height: 4rem;
          border-radius: ${theme.borderRadius['2xl']};
        `;
      default:
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[7]};
          font-size: ${theme.fontSizes.base};
          height: 3rem;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.gray[100]} 0%, ${theme.colors.gray[50]} 100%);
          color: ${theme.colors.gray[800]};
          border-color: ${theme.colors.gray[200]};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.gray[200]} 0%, ${theme.colors.gray[100]} 100%);
            border-color: ${theme.colors.gray[300]};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[300]};
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            border-radius: inherit;
          }

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.primary[25]} 100%);
            border-color: ${theme.colors.primary[500]};
            color: ${theme.colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${theme.colors.primary[200]};

            &::after {
              opacity: 1;
            }
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px ${theme.colors.primary[200]};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.primary[600]};
          border-color: transparent;

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.primary[25]} 100%);
            color: ${theme.colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${theme.colors.primary[100]};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px ${theme.colors.primary[100]};
          }
        `;
      case 'success':
        return css`
          background: linear-gradient(135deg, ${theme.colors.success} 0%, #10b981 100%);
          color: ${theme.colors.white};
          border-color: ${theme.colors.success};
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-color: #10b981;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        `;
      case 'warning':
        return css`
          background: linear-gradient(135deg, ${theme.colors.warning} 0%, #f59e0b 100%);
          color: ${theme.colors.white};
          border-color: ${theme.colors.warning};
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border-color: #f59e0b;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          }
        `;
      case 'error':
        return css`
          background: linear-gradient(135deg, ${theme.colors.error} 0%, #dc2626 100%);
          color: ${theme.colors.white};
          border-color: ${theme.colors.error};
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            border-color: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[500]};
          box-shadow: 0 4px 12px ${theme.colors.primary[200]};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%);
            border-color: ${theme.colors.primary[600]};
            transform: translateY(-2px);
            box-shadow: 0 8px 25px ${theme.colors.primary[300]};
          }

          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px ${theme.colors.primary[200]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;

    &::before {
      display: none;
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primary[200]};
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
  }

  /* 로딩 상태 스타일 */
  &[data-loading="true"] {
    pointer-events: none;
    opacity: 0.8;
  }

  /* 아이콘과 텍스트 간격 조정 */
  svg {
    flex-shrink: 0;
  }

  /* 로딩 스피너 애니메이션 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className,
  as,
  href,
  loading = false,
  ...props
}) => {
  return (
    <StyledButton
      as={as}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      href={href}
      data-loading={loading}
      {...props}
    >
      {loading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="60"
          />
        </svg>
      )}
      {children}
    </StyledButton>
  );
};

export default Button;

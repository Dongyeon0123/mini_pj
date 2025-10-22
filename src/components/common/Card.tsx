import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'padding', 'hover'].includes(prop),
})<Omit<CardProps, 'hover'> & { $hover?: boolean }>`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  transition: all 0.2s ease;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'elevated':
        return css`
          box-shadow: ${theme.shadows.lg};
          border: none;
        `;
      case 'outlined':
        return css`
          border: 1px solid ${theme.colors.gray[200]};
          box-shadow: none;
        `;
      default:
        return css`
          box-shadow: ${theme.shadows.base};
          border: 1px solid ${theme.colors.gray[100]};
        `;
    }
  }}

  ${({ padding = 'md' }) => {
    switch (padding) {
      case 'sm':
        return css`
          padding: ${theme.spacing[4]};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[8]};
        `;
      default:
        return css`
          padding: ${theme.spacing[6]};
        `;
    }
  }}

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.xl};
      }
    `}
`;

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  onClick,
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      $hover={hover}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

export default Card;

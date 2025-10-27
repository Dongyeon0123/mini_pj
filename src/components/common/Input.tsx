import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.gray[700]};
`;

const StyledInput = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 1px solid ${({ $error }) => ($error ? theme.colors.error : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.fontSizes.base};
  font-family: inherit;
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[800]};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? theme.colors.error : theme.colors.primary[500])};
    box-shadow: 0 0 0 3px ${({ $error }) => 
      $error ? `${theme.colors.error}20` : `${theme.colors.primary[500]}20`
    };
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.error};
  margin-top: ${theme.spacing[1]};
`;

const Required = styled.span`
  color: ${theme.colors.error};
  margin-left: ${theme.spacing[1]};
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  className,
}) => {
  return (
    <InputContainer className={className}>
      {label && (
        <Label>
          {label}
          {required && <Required>*</Required>}
        </Label>
      )}
      <StyledInput
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        $error={error}
      />
      {error && errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </InputContainer>
  );
};

export default Input;

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    ...style,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#1890ff',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#f0f0f0',
      color: '#000',
    },
  };

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant] }} {...props}>
      {children}
    </button>
  );
};

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-label-caps text-label-caps py-4 px-8 border transition-all duration-300 select-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-on-primary border-primary hover:bg-on-surface-variant hover:border-on-surface-variant',
    secondary: 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
    outline: 'border-primary text-primary hover:bg-primary hover:text-on-primary',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

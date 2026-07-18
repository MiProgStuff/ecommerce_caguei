import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="font-label-caps text-label-caps text-on-surface mb-2 select-none">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-label-caps text-label-caps focus:outline-none focus:ring-0 focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
        {...props}
      />
      {error && (
        <span className="font-label-caps text-[10px] text-error mt-1 uppercase tracking-wider">
          {error}
        </span>
      )}
    </div>
  );
}

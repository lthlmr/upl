import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  const baseStyles = 'relative rounded-lg font-medium transition-all duration-200 focus:outline-none flex items-center justify-center overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-purple-700 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl shadow-purple-900/30 border border-purple-500/20 hover:after:opacity-20 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition-opacity',
    secondary: 'bg-violet-900 hover:bg-violet-800 text-white shadow-lg hover:shadow-xl shadow-violet-900/30 border border-violet-600/20',
    success: 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl shadow-emerald-900/30 border border-emerald-500/20',
    danger: 'bg-red-700 hover:bg-red-600 text-white shadow-lg hover:shadow-xl shadow-red-900/30 border border-red-500/20',
    outline: 'bg-transparent hover:bg-purple-900/20 text-purple-400 hover:text-purple-300 border border-purple-700/50 hover:border-purple-600',
    ghost: 'bg-transparent text-gray-400 hover:text-purple-300 hover:bg-purple-900/20',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 space-x-1.5',
    md: 'text-sm px-4 py-2 space-x-2',
    lg: 'text-base px-5 py-2.5 space-x-2.5',
    xl: 'text-lg px-6 py-3 space-x-3',
  };
  
  const disabledStyles = 'opacity-60 cursor-not-allowed after:hidden';
  const loadingStyles = 'cursor-wait';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const computedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled || isLoading ? disabledStyles : ''}
    ${isLoading ? loadingStyles : ''}
    ${widthStyles}
    ${className}
  `;

  return (
    <button
      className={computedClassName}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
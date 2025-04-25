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
    primary: 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-lg hover:shadow-xl shadow-purple-900/30 border border-purple-400/30 hover:border-purple-300/50 transform hover:scale-105 transition-all duration-300',
    secondary: 'bg-purple-900/60 hover:bg-purple-800/80 text-white shadow-lg hover:shadow-xl shadow-purple-900/30 border border-purple-600/20 backdrop-blur-sm',
    success: 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl shadow-emerald-900/30 border border-emerald-500/20',
    danger: 'bg-red-700 hover:bg-red-600 text-white shadow-lg hover:shadow-xl shadow-red-900/30 border border-red-500/20',
    outline: 'bg-transparent hover:bg-purple-900/20 text-purple-400 hover:text-purple-300 border border-purple-700/50 hover:border-purple-600 backdrop-blur-sm transform hover:scale-105 transition-all duration-300',
    ghost: 'bg-transparent text-gray-400 hover:text-purple-300 hover:bg-purple-900/20 backdrop-blur-sm',
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
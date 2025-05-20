import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, icon, helpText, className = '', ...props }, ref) => {
    const baseStyles = 'block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
    const errorStyles = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    const iconStyles = icon ? 'pl-10' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${errorStyles}
              ${widthStyles}
              ${iconStyles}
              ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : helpText ? `${props.id}-description` : undefined}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${props.id}-description`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
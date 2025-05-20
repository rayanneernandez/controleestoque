import React, { forwardRef, SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
  helpText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, helpText, className = '', ...props }, ref) => {
    const baseStyles = 'block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
    const errorStyles = error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : '';
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            ${baseStyles}
            ${errorStyles}
            ${widthStyles}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : helpText ? `${props.id}-description` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

export default Select;
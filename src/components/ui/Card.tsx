import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  footer?: ReactNode;
  hoverable?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
  hoverable = false,
  noPadding = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
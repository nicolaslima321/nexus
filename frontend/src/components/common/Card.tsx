import React from 'react';

interface ICard {
  children: React.ReactNode;
  className?: string;
  key?: string | number;
};

export default function Card({ className, children, ...rest }: ICard) {
  return (
    <div className={`block bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 max-w-sm ${className}`} {...rest}>
      {children}
    </div>
  );
};

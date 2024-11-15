import React from 'react';

interface ICard {
  children: React.ReactNode;
  key?: string | number;
};

export default function Card({ children, ...rest }: ICard) {
  return (
    <div className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" {...rest}>
      {children}
    </div>
  );
};

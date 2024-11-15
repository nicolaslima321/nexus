import React from 'react';

interface ICard {
  children: React.ReactNode;
  key?: string | number;
};

export default function Card({ children, ...rest }: ICard) {
  return (
    <div className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow p-3 sm:p-6" {...rest}>
      {children}
    </div>
  );
};

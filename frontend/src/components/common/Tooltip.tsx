"use client";

import React, { useState } from "react";

interface ITooltip {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: ITooltip) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && (
        <div
          role="tooltip"
          className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 dark:bg-gray-700 mt-2"
        >
          {text}

          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
    </>
  );
}

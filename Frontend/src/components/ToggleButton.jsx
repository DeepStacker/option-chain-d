import React from 'react';

export default function ToggleButton({ setIsReversed, setIsHighlighting, isHighlighting, isReversed }) {
  return (
    <div className="flex gap-4 z-20">
      <button
        id="toggleOrder"
        onClick={() => setIsReversed((prev) => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Toggle Order
      </button>

      <button
        id="toggleHighlight"
        onClick={() => setIsHighlighting((prev) => !prev)}
        className={`bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out ${
          isHighlighting ? 'hover:bg-green-700' : 'hover:bg-green-500'
        } focus:outline-none focus:ring-2 focus:ring-green-300`}
      >
        {isHighlighting ? 'Disable' : 'Enable'} Highlighting
      </button>
    </div>
  );
}

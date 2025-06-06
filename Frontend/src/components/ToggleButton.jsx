import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  setIsHighlighting,
  setIsReversed,
  setIsItmHighlighting
} from "../context/themeSlice";

export default function ToggleButton() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);
  const isItmHighlighting = useSelector((state) => state.theme.isItmHighlighting);

  return (
    <div className="flex gap-1 lg:gap-2">
      <button
        id="toggleOrder"
        onClick={() => dispatch(setIsReversed())}
        className={`px-2 lg:px-4 py-1 lg:py-1 text-xs lg:text-sm rounded-md transition-colors whitespace-nowrap
          ${theme === 'dark' 
            ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300' 
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
      >
        Toggle Order
      </button>

      <button
        id="toggleHighlight"
        onClick={() => dispatch(setIsHighlighting())}
        className={`px-2 lg:px-4 py-0 lg:py-0 text-xs lg:text-sm rounded-md transition-colors whitespace-nowrap
          ${isHighlighting ? 
            (theme === 'dark' 
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' 
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            ) 
            : 
            (theme === 'dark' 
              ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300' 
              : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
            )
          } text-white`}
      >
        <span className="hidden sm:inline">
          {isHighlighting ? 'Disable' : 'Enable'} Highlighting
        </span>
        <span className="sm:hidden">
          {isHighlighting ? 'Off' : 'On'}
        </span>
      </button>
      <button
        id="toggleHighlight"
        onClick={() => dispatch(setIsItmHighlighting())}
        className={`px-2 lg:px-4 py-0 lg:py-0 text-xs lg:text-sm rounded-md transition-colors whitespace-nowrap
          ${isItmHighlighting ? 
            (theme === 'dark' 
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' 
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            ) 
            : 
            (theme === 'dark' 
              ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300' 
              : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
            )
          } text-white`}
      >
        <span className="hidden sm:inline">
          {isItmHighlighting ? 'Disable' : 'Enable'} ITM-Highlighting
        </span>
        <span className="sm:hidden">
          {isItmHighlighting ? 'Off' : 'On'}
        </span>
      </button>
    </div>
  );
}

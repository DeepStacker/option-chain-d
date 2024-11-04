import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  setIsHighlighting,
  setIsReversed,
} from "../context/themeSlice";

export default function ToggleButton() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);

  return (
    <div className="flex gap-2 z-20 transition  ease-in-out">
      <button
        id="toggleOrder"
        onClick={() => dispatch(setIsReversed())}
        className={`px-4 py-0 rounded-md transition  ease-in-out 
          ${theme === 'dark' ? 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`}
      >
        Toggle Order
      </button>

      <button
        id="toggleHighlight"
        onClick={() => dispatch(setIsHighlighting())}
        className={`px-4 py-1 rounded-md transition  ease-in-out 
          ${isHighlighting ? 
            (theme === 'dark' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500') 
            : 
            (theme === 'dark' ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300' : 'bg-green-600 hover:bg-green-500 focus:ring-green-500')
          } text-white`}
      >
        {isHighlighting ? 'Disable' : 'Enable'} Highlighting
      </button>
    </div>
  );
}

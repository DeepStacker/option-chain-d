import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  setIsHighlighting,
  setIsReversed,
  toggleTheme,
} from "../context/themeSlice";

export default function ToggleButton() {
  const dispatch = useDispatch();

  // Theme state
  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);

  return (
    <div className="flex gap-4 z-20">
      <button
        id="toggleOrder"
        onClick={() => dispatch(setIsReversed())}
        className="bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Toggle Order
      </button>

      <button
        id="toggleHighlight"
        onClick={() => dispatch(setIsHighlighting())}
        className={`bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out ${
          isHighlighting ? 'hover:bg-green-700' : 'hover:bg-green-500'
        } focus:outline-none focus:ring-2 focus:ring-green-300`}
      >
        {isHighlighting ? 'Disable' : 'Enable'} Highlighting
      </button>
    </div>
  );
}

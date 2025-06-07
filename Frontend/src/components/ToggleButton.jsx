import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsHighlighting,
  setIsReversed,
  setIsItmHighlighting,
} from "../context/themeSlice";

export default function ToggleButton() {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  const isReversed = useSelector((state) => state.theme.isReversed);
  const isHighlighting = useSelector((state) => state.theme.isHighlighting);
  const isItmHighlighting = useSelector(
    (state) => state.theme.isItmHighlighting
  );

  const getButtonClasses = (active) => {
    if (active) {
      return theme === "dark"
        ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
        : "bg-green-600 hover:bg-green-700 focus:ring-green-500";
    } else {
      return theme === "dark"
        ? "bg-gray-500 hover:bg-gray-600 focus:ring-gray-300"
        : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500";
    }
  };

  return (
    <div className="flex flex-nowrap gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
      <button
        id="toggleOrder"
        onClick={() => dispatch(setIsReversed())}
        className={`flex-shrink px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-md transition-colors whitespace-nowrap
          ${
            theme === "dark"
              ? "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-300"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          }`}
      >
        Order
      </button>

      <button
        id="toggleHighlight"
        onClick={() => dispatch(setIsHighlighting())}
        className={`flex-shrink px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-md transition-colors whitespace-nowrap ${getButtonClasses(
          isHighlighting
        )} text-white`}
      >
        {isHighlighting ? "Highlight On" : "Highlight Off"}
      </button>

      <button
        id="toggleITMHighlight"
        onClick={() => dispatch(setIsItmHighlighting())}
        className={`flex-shrink px-2 sm:px-3 py-1 text-[10px] sm:text-xs rounded-md transition-colors whitespace-nowrap ${getButtonClasses(
          isItmHighlighting
        )} text-white`}
      >
        {isItmHighlighting ? "ITM On" : "ITM Off"}
      </button>
    </div>
  );
}

import React from "react";
import loading from "../assets/loading-1.gif";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <img src={loading} alt="Loading" className="w-16 h-16" />
    </div>
  );
}

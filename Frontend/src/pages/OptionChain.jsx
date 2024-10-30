// src/App.js
import { useContext } from "react";  // No need to import 'React' explicitly (React 17+)
import SpotData from "../components/SpotData";
import OptionsTable from "../components/OptionsTable";
import DateList from "../components/DateList";
import Spinner from "../components/Spinner";
import { AppContext } from "../context/AppProvider";

function OptionChain() {
  const { data } = useContext(AppContext);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-full space-y-4">
        {/* Conditional rendering of content based on data availability */}
        {data ? (
          <>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <SpotData />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4">
              <DateList />
            </div>

            <div className="flex flex-col flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
              <OptionsTable />
            </div>
          </>
        ) : (
          <div
            className="bg-white rounded-lg shadow-md p-6 mb-0.5 text-center"
            role="status"
            aria-live="polite"
          >
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}

export default OptionChain;

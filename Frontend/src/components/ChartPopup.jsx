// Popup.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'; // Import zoom plugin
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Register Chart.js modules and zoom plugin
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  zoomPlugin
);

const Popup = ({ data, onClose }) => {
  if (!data) return null;

  // Helper function: Convert timestamps to 'HH:MM' format
  const formatTimestamps = (timestamps) =>
    timestamps.map((ts) =>
      new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

  const shortTimeLabels = formatTimestamps(data.timestamp);

  const chartData = {
    labels: shortTimeLabels,
    datasets: [
      {
        label: 'OI Change',
        data: data.oichng,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2, // Thicker line for clarity
        tension: 0.1, // Smooth the line
      },
      {
        label: '(OI)',
        data: data.oi,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'Volume',
        data: data.vol,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true, // Show tooltip on hover
        mode: 'nearest',
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true, // Enable zoom on mouse wheel
          },
          pinch: {
            enabled: true, // Enable zoom on pinch gestures
          },
          mode: 'xy', // Zoom both X and Y axes
        },
        pan: {
          enabled: true,
          mode: 'xy', // Pan both X and Y axes
        },
      },
    },
    // scales: {
    //   x: {
    //     title: {
    //       display: true,
    //       text: 'Time',
    //     },
    //   },
    //   y: {
    //     title: {
    //       display: true,
    //       text: 'Value',
    //     },
    //   },
    // },
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-teal-400 bg-opacity-75 rounded-lg p-1 shadow-lg w-[97%] h-[95%] z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center relative w-full h-full">
        <button
          className="absolute top-1 right-2 text-gray-800 hover:text-gray-600 transition duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close Popup"
        >
          <FaTimes size={24} />
        </button>

        <p className="text-2xl font-bold text-gray-800 ">
          {data.strike} {data.isCe ? 'CE' : 'PE'}
        </p>

        <div className="bg-gray-100 bg-opacity-80 p-2 rounded-lg shadow-md w-full h-[95%]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Prop types for validation
Popup.propTypes = {
  data: PropTypes.shape({
    timestamp: PropTypes.arrayOf(PropTypes.string).isRequired,
    oichng: PropTypes.arrayOf(PropTypes.number).isRequired,
    oi: PropTypes.arrayOf(PropTypes.number).isRequired,
    vol: PropTypes.arrayOf(PropTypes.number).isRequired,
    strike: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isCe: PropTypes.bool.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Popup;

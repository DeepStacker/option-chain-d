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
import { useSelector } from 'react-redux';

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
  const theme = useSelector((state) => state.theme.theme);
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
        borderColor: theme === 'dark' ? 'rgba(150, 230, 150, 1)' : 'rgba(75, 192, 192, 1)',
        backgroundColor: theme === 'dark' ? 'rgba(150, 230, 150, 0.2)' : 'rgba(75, 192, 192, 0.2)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'OI',
        data: data.oi,
        borderColor: theme === 'dark' ? 'rgba(250, 150, 150, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: theme === 'dark' ? 'rgba(250, 150, 150, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'Volume',
        data: data.vol,
        borderColor: theme === 'dark' ? 'rgba(130, 160, 230, 1)' : 'rgba(54, 162, 235, 1)',
        backgroundColor: theme === 'dark' ? 'rgba(130, 160, 230, 0.2)' : 'rgba(54, 162, 235, 0.2)',
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
        labels: {
          color: theme === 'dark' ? '#e0e0e0' : '#333',
        },
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#e0e0e0' : '#333',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#e0e0e0' : '#333',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-teal-400'} bg-opacity-75 
                  rounded-lg p-1 shadow-lg w-[97%] h-[95%] z-50`}
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
          <FaTimes size={24} color={theme === 'dark' ? '#e0e0e0' : '#333'} />
        </button>

        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {data.strike} {data.isCe ? 'CE' : 'PE'}
        </p>

        <div className={`p-2 rounded-lg shadow-md w-full h-[95%] ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} bg-opacity-80`}>
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

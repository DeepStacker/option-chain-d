import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatChartNumber } from '../../utils/utils';

// Register Chart.js modules and plugins
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, zoomPlugin);

const FuturePopup = ({ onClose }) => {
    const data = useSelector((state) => state.optionChain.popupData);
    const theme = useSelector((state) => state.theme.theme);
    const [activeSection, setActiveSection] = useState('Future');

    if (!data) return null;

    const themeColors = {
        background: theme === 'dark' ? 'bg-gray-800' : 'bg-teal-400',
        text: theme === 'dark' ? '#e0e0e0' : '#333',
        gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    };

    const formatTimestamps = (timestamps) =>
        timestamps.map((ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const shortTimeLabels = formatTimestamps(data.timestamp);

    const createDataset = (label, data, color, axis, hidden = false) => ({
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace('1)', '0.2)'),
        fill: false,
        pointRadius: 0,
        borderWidth: 1,
        tension: 0.1,
        hidden, // Default hidden state
        yAxisID: axis, // Specify which y-axis to use
    });

    const chartData = {
        labels: shortTimeLabels,
        datasets:
            activeSection === 'Future'
                ? [
                    createDataset('Future Ltp', data.ltp, 'rgba(0, 0, 255, 1)', 'y1'), // Right y-axis for LTP
                    createDataset('Future OIChng', data.oichng, 'rgba(0, 255, 0, 1)', 'y', true), // Left y-axis for OI Change
                    createDataset('Future OI', data.oi, 'rgba(255, 0, 0, 1)', 'y'), // Left y-axis for OI
                ]
                : [],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: themeColors.text,
                    font: {
                        size: 16,
                        family: 'Courier New, monospace',
                    },
                    padding: 2,
                    boxWidth: 10,
                    boxHeight: 10,
                },
                onHover: (event, legendItem) => {
                    const label = event.native.target;
                    label.style.cursor = 'pointer';
                    label.style.fontSize = '16px';
                    label.style.color = 'rgba(255, 0, 0, 1)';
                },
                onLeave: (event) => {
                    const label = event.native.target;
                    label.style.fontSize = '12px';
                    label.style.color = themeColors.text;
                },
            },
            tooltip: {
                mode: 'nearest',
                intersect: false,
            },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'xy',
                },
                pan: { enabled: true, mode: 'xy' },
            },
        },
        scales: {
            x: {
                ticks: { color: themeColors.text },
                grid: { color: themeColors.gridColor },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: { color: themeColors.text },
                grid: { color: themeColors.gridColor },
                title: {
                    display: true,
                    text: 'OI / OI Change',
                    color: themeColors.text,
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: { color: themeColors.text },
                grid: { drawOnChartArea: false }, // Prevents grid overlap with the left y-axis
                title: {
                    display: true,
                    text: 'LTP',
                    color: themeColors.text,
                },
            },
        },
    };

    return (
        <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${themeColors.background}  rounded-lg p-4 w-[97%] h-[95%] z-50`}
            role="dialog"
            aria-modal="true"
        >
            <div className="flex flex-col items-center relative w-full h-full">
                <button onClick={onClose} aria-label="Close Popup" className="absolute top-1 right-2 text-gray-800 hover:text-gray-600">
                    <FaTimes size={24} color={themeColors.text} />
                </button>
                <p className={`text-2xl font-bold ${themeColors.text}`}>
                    Future Buildup
                </p>

                <div className="flex justify-center gap-4 my-4">
                    <p
                        onClick={() => setActiveSection('Future')}
                        className={`py-0 cursor-pointer px-4 rounded ${activeSection === 'Future' ? 'bg-white text-gray-800' : 'bg-gray-500 text-gray-200'}`}
                    >
                        Future
                    </p>
                </div>

                <div className="w-full h-full p-4">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

FuturePopup.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default FuturePopup;

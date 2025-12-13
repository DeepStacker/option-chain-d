
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectSpotPrice, selectSelectedSymbol, selectFuturesData } from '../context/selectors';
import { setSidAndFetchData } from '../context/dataSlice';
import { Button, Card } from '../components/common';
import { 
  ChartBarIcon, 
  UserCircleIcon, 
  ArrowTrendingUpIcon, 
  CalculatorIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const spotPrice = useSelector(selectSpotPrice);
  const symbol = useSelector(selectSelectedSymbol);
  const futuresData = useSelector(selectFuturesData);
  const navigate = useNavigate();

  // Fetch initial market data on mount
  useEffect(() => {
    if (!spotPrice) {
      dispatch(setSidAndFetchData({ newSid: 'NIFTY' }));
    }
  }, [dispatch, spotPrice]);

  const features = [
    {
      title: 'Option Chain',
      description: 'Real-time F&O data with Greeks, IV, and PCR analysis',
      icon: ChartBarIcon,
      action: () => navigate('/option-chain'),
      color: 'bg-blue-500',
    },
    {
      title: 'Analytics',
      description: 'OI Analysis, Volume, Greeks, Straddle & Strategy Builder',
      icon: BeakerIcon,
      action: () => navigate('/analytics'),
      color: 'bg-indigo-500',
    },
    {
      title: 'Trading Charts',
      description: 'Live candlestick charts with support/resistance levels',
      icon: PresentationChartLineIcon,
      action: () => navigate('/charts'),
      color: 'bg-green-500',
    },
    {
      title: 'Position Sizing',
      description: 'Calculate optimal position size based on risk parameters',
      icon: CalculatorIcon,
      action: () => navigate('/position-sizing'),
      color: 'bg-orange-500',
    },
    {
      title: 'TCA Calculator',
      description: 'Transaction Cost Analysis for trade optimization',
      icon: ArrowTrendingUpIcon,
      action: () => navigate('/tca'),
      color: 'bg-pink-500',
    },
    {
      title: 'Profile',
      description: 'Manage your account settings and preferences',
      icon: UserCircleIcon,
      action: () => navigate('/profile'),
      color: 'bg-purple-500',
    },
  ];

  const marketIndices = [
    { 
      name: 'NIFTY 50', 
      price: symbol === 'NIFTY' ? spotPrice : null,
      change: futuresData?.change || 0,
      changePercent: futuresData?.changePercent || 0,
    },
    { 
      name: 'BANK NIFTY', 
      price: symbol === 'BANKNIFTY' ? spotPrice : null,
      change: 0,
      changePercent: 0,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | Stockify</title>
      </Helmet>

      <div className="w-full px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Trader'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here&apos;s your market overview for today.
          </p>
        </div>

        {/* Live Market Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Live Market
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketIndices.map((index, i) => (
              <Card key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{index.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {index.price ? `₹${index.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                  </p>
                </div>
                <div className={`text-right ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {index.price ? (
                    <>
                      <p className="text-lg font-semibold">
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                      </p>
                      <p className="text-sm">
                        ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                      </p>
                    </>
                  ) : (
                    <button 
                      onClick={() => dispatch(setSidAndFetchData({ newSid: index.name === 'NIFTY 50' ? 'NIFTY' : 'BANKNIFTY' }))}
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                      Load
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="elevated"
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={feature.action}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                {feature.description}
              </p>

              <Button
                variant="outline"
                fullWidth
                onClick={(e) => { e.stopPropagation(); feature.action(); }}
              >
                Launch
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;


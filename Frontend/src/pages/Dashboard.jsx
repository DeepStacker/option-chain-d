
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../context/selectors';
import { Button, Card } from '../components/common';
import { ChartBarIcon, UserCircleIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  const features = [
    {
      title: 'Option Chain',
      description: 'Real-time F&O data with Greeks, IV, and PCR analysis',
      icon: ChartBarIcon,
      action: () => navigate('/option-chain'),
      color: 'bg-blue-500',
    },
    {
      title: 'Technical Analysis',
      description: 'Advanced charting and technical indicators (Coming Soon)',
      icon: ArrowTrendingUpIcon,
      action: () => navigate('/charts'),
      color: 'bg-green-500',
    },
    {
      title: 'User Profile',
      description: 'Manage your account settings and preferences',
      icon: UserCircleIcon,
      action: () => navigate('/profile'),
      color: 'bg-purple-500',
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
            Welcome back, {user?.name || 'Trader'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here&apos;s your market overview for today.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="elevated"
              className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${feature.color} text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 mb-6 h-12">
                {feature.description}
              </p>

              <Button
                variant="outline"
                fullWidth
                onClick={feature.action}
              >
                Launch
              </Button>
            </Card>
          ))}
        </div>

        {/* Recent Activity / Market Summary (Placeholder for Future Real Data) */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Market Status
          </h2>
          <Card>
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <p>NIFTY 50 and BANKNIFTY data is live.</p>
                <p className="text-sm mt-2">Go to Option Chain to view details.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

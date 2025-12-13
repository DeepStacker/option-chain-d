
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '../components/common';
import { selectIsAuthenticated } from '../context/selectors';

const Home = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: ChartBarIcon,
      title: "Real-Time Options Chain",
      description: "Live data for NIFTY, BANKNIFTY, and FINNIFTY with advanced Greeks (Delta, Theta, Gamma, Vega).",
    },
    {
      icon: BoltIcon,
      title: "Built-in Analysis",
      description: "Automatic calculation of PCR, Max Pain, and Build-up trends (Long/Short) to identify market direction.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Reliable",
      description: "Institutional-grade data reliability with secure user authentication and preference management.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Stockify | Pro Options Analysis</title>
        <meta name="description" content="Real-time NSE Option Chain analysis platform." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Master the <span className="text-blue-600 dark:text-blue-500">Markets</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Advanced Option Chain analysis with real-time Greeks and market indicators.
            Simplify your trading decisions with data-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="xl"
              onClick={handleGetStarted}
              icon={ArrowRightIcon}
              iconPosition="right"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Analyzing Now'}
            </Button>

            {!isAuthenticated && (
              <Link to="/login">
                <Button size="xl" variant="outline">
                  Login Existing Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 dark:opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Stockify?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center h-full hover:shadow-xl transition-all duration-300"
                padding="xl"
              >
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to trade smarter?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join professional traders who use Stockify for their daily market analysis.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started for Free
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;


import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import OptionChainTable from '../components/features/options/OptionChainTable';
import { selectIsAuthenticated } from '../context/selectors';
import { ColumnConfigProvider } from '../context/ColumnConfigContext';
import { TableSettingsProvider } from '../context/TableSettingsContext';
import { Button } from '../components/common';
import { useNavigate } from 'react-router-dom';

/**
 * Option Chain Page - Full screen table view
 */
const OptionChain = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400">Please log in to view real-time option chain data.</p>
        <Button onClick={() => navigate('/login')}>Login Now</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Option Chain | Stockify</title>
        <meta name="description" content="Real-time NSE Option Chain with advanced Greeks and analysis" />
      </Helmet>

      <ColumnConfigProvider>
        <TableSettingsProvider>
          <div className="w-full px-2 py-2">
            <OptionChainTable />
          </div>
        </TableSettingsProvider>
      </ColumnConfigProvider>
    </>
  );
};

export default OptionChain;




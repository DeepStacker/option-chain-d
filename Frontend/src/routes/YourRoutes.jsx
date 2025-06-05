import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'; // Import your components
import About from '../pages/About';
import OptionsTable from '../components/OptionsTable';

const YourRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/advanced-option-chain" element={<OptionsTable />} />
    </Routes>
  );
};

export default YourRoutes;

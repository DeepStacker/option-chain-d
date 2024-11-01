import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSymbol } from "../context/dataSlice";

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const symbol = useSelector((state) => state.data.symbol);
  const theme = useSelector((state) => state.theme.theme);

  const handleChange = (event) => {
    const selectedSymbol = event.target.value;
    dispatch(setSymbol(selectedSymbol));
  };

  return (
    <div className="form-group mb-1">
      <label htmlFor="ticker" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Ticker
      </label>
      <select
        id="ticker"
        name="ticker"
        className={` block w-full rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500`}
        value={symbol}
        onChange={handleChange}
        required
      >
        <option value="NIFTY">NIFTY</option>
        <option value="BANKNIFTY">BANKNIFTY</option>
        <option value="FINNIFTY">FINNIFTY</option>
        <option value="MIDCPNIFTY">MIDCPNIFTY</option>
        <option value="NIFTYNXT50">NIFTYNXT50</option>
        <option value="SENSEX">SENSEX</option>
        <option value="BANKEX">BANKEX</option>
        <option value="SHRIRAMFIN">SHRIRAMFIN</option>
        <option value="MM">MM</option>
        <option value="HDFCLIFE">HDFCLIFE</option>
        <option value="DIVISLAB">DIVISLAB</option>
        <option value="TITAN">TITAN</option>
        <option value="LT">LT</option>
        <option value="CRUDEOIL">CRUDEOIL</option>
      </select>
    </div>
  );
};

export default TickerDropdown;

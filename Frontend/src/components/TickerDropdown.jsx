import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSymbol } from "../context/dataSlice";

const TickerDropdown = () => {
  const dispatch = useDispatch();
  const symbol = useSelector((state) => state.data.symbol);

  const handleChange = (event) => {
    const selectedSymbol = event.target.value;
    console.log(selectedSymbol)
    dispatch(setSymbol(selectedSymbol));
  };

  return (
    <div className="form-group">
      <label htmlFor="ticker">Ticker</label>
      <select
        id="ticker"
        name="ticker"
        className="form-control"
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

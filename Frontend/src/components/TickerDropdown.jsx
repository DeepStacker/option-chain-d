import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppProvider'

const TickerDropdown = () => {
  const {symbol, setSymbol } = useContext(AppContext)

  const handleChange = (event) => {
    setSymbol(event.target.value);
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
        {/* <option value="LTIM">LTIM</option>
        <option value="INDUSINDBK">INDUSINDBK</option>
        <option value="TECHM">TECHM</option>
        <option value="TCS">TCS</option>
        <option value="WIPRO">WIPRO</option>
        <option value="ULTRACEMCO">ULTRACEMCO</option>
        <option value="BAJFINANCE">BAJFINANCE</option>
        <option value="BPCL">BPCL</option>
        <option value="HINDALCO">HINDALCO</option>
        <option value="ADANIPORTS">ADANIPORTS</option>
        <option value="SBIN">SBIN</option>
        <option value="INFY">INFY</option>
        <option value="APOLLOHOSP">APOLLOHOSP</option>
        <option value="KOTAKBANK">KOTAKBANK</option>
        <option value="ONGC">ONGC</option>
        <option value="DRREDDY">DRREDDY</option>
        <option value="HCLTECH">HCLTECH</option>
        <option value="HDFCBANK">HDFCBANK</option>
        <option value="BAJAJFINSV">BAJAJFINSV</option>
        <option value="NESTLEIND">NESTLEIND</option>
        <option value="CIPLA">CIPLA</option>
        <option value="ASIANPAINT">ASIANPAINT</option>
        <option value="GRASIM">GRASIM</option>
        <option value="SUNPHARMA">SUNPHARMA</option>
        <option value="BAJAJ-AUTO">BAJAJ-AUTO</option>
        <option value="HEROMOTOCO">HEROMOTOCO</option>
        <option value="TATASTEEL">TATASTEEL</option>
        <option value="ADANIENT">ADANIENT</option>
        <option value="RELIANCE">RELIANCE</option>
        <option value="MARUTI">MARUTI</option>
        <option value="TATAMOTORS">TATAMOTORS</option>
        <option value="COALINDIA">COALINDIA</option>
        <option value="NTPC">NTPC</option>
        <option value="JSWSTEEL">JSWSTEEL</option>
        <option value="ITC">ITC</option>
        <option value="SBILIFE">SBILIFE</option>
        <option value="ICICIBANK">ICICIBANK</option>
        <option value="BHARTIARTL">BHARTIARTL</option>
        <option value="TATACONSUM">TATACONSUM</option>
        <option value="BRITANNIA">BRITANNIA</option>
        <option value="POWERGRID">POWERGRID</option>
        <option value="AXISBANK">AXISBANK</option>
        <option value="EICHERMOT">EICHERMOT</option>
        <option value="HINDUNILVR">HINDUNILVR</option> */}
        {/* Commodity */}
        <option value="CRUDEOIL">CRUDEOIL</option>
        {/* <option value="CRUDEOILM">CRUDEOILM</option>
        <option value="NATURALGAS">NATURALGAS</option>
        <option value="NATGASMINI">NATGASMINI</option>
        <option value="GOLD">GOLD</option>
        <option value="GOLDM">GOLDM</option>
        <option value="SILVER">SILVER</option>
        <option value="SILVERM">SILVERM</option>
        <option value="COPPER">COPPER</option> */}
      </select>
    </div>
  );
};

export default TickerDropdown;

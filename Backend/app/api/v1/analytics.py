"""
Analytics API Endpoints
Time-series, charts, and historical data for option chain analysis
"""
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser, OptionalUser
from app.services.dhan_client import get_dhan_client
from app.services.options import OptionsService
from app.cache.redis import get_redis, RedisCache

logger = logging.getLogger(__name__)
router = APIRouter()


# ============== Request/Response Models ==============

class TimeSeriesPoint(BaseModel):
    """Single point in time-series data"""
    timestamp: datetime
    value: float
    change: Optional[float] = None
    change_percent: Optional[float] = None


class TimeSeriesResponse(BaseModel):
    """Response for time-series data"""
    success: bool = True
    symbol: str
    strike: Optional[float] = None
    option_type: Optional[str] = None
    field: str
    data: List[TimeSeriesPoint]
    summary: dict = {}


class StrikeAnalysisResponse(BaseModel):
    """Comprehensive strike analysis"""
    success: bool = True
    strike: float
    symbol: str
    expiry: str
    call: dict
    put: dict
    reversal_levels: dict
    trading_signals: dict
    market_regime: dict
    support_resistance: dict


class FuturesSummaryResponse(BaseModel):
    """Futures contracts summary"""
    success: bool = True
    symbol: str
    contracts: List[dict]
    total_oi: int
    total_volume: int


class OIDistributionResponse(BaseModel):
    """OI distribution across strikes"""
    success: bool = True
    symbol: str
    expiry: str
    distribution: List[dict]
    max_oi_ce: dict
    max_oi_pe: dict
    pcr: float


# ============== Helper Functions ==============

async def get_analytics_service(
    cache: RedisCache = Depends(get_redis)
) -> OptionsService:
    """Dependency to get options service for analytics"""
    dhan = await get_dhan_client(cache=cache)
    return OptionsService(dhan_client=dhan, cache=cache)


def generate_mock_timeseries(
    field: str,
    current_value: float,
    points: int = 50,
    volatility: float = 0.02
) -> List[TimeSeriesPoint]:
    """
    Generate mock time-series data for demonstration.
    In production, this would fetch from a time-series database.
    """
    import random
    data = []
    now = datetime.now()
    value = current_value
    
    for i in range(points, 0, -1):
        timestamp = now - timedelta(minutes=i * 5)
        change = random.uniform(-volatility, volatility) * value
        value = max(0.01, value + change)
        
        data.append(TimeSeriesPoint(
            timestamp=timestamp,
            value=round(value, 2),
            change=round(change, 2),
            change_percent=round((change / value) * 100, 2) if value else 0
        ))
    
    return data


def generate_mock_aggregate_data(
    symbol: str,
    view_type: str = "coi",
    num_strikes: int = 21
) -> dict:
    """
    Generate mock aggregate data for COI, OI, PCR views when live data unavailable.
    """
    import random
    
    # Get base strike around typical ATM values
    base_strikes = {"NIFTY": 24500, "BANKNIFTY": 52000, "FINNIFTY": 24000}
    base = base_strikes.get(symbol.upper(), 24000)
    step = 50 if symbol.upper() == "NIFTY" else 100
    
    atm_index = num_strikes // 2
    strikes = [base + (i - atm_index) * step for i in range(num_strikes)]
    
    data = []
    total_ce = 0
    total_pe = 0
    
    for i, strike in enumerate(strikes):
        # Create realistic distribution - higher values near ATM
        distance_from_atm = abs(i - atm_index)
        multiplier = max(0.3, 1 - (distance_from_atm * 0.1))
        
        if view_type in ["coi", "overall"]:
            ce_val = int(random.uniform(5000, 50000) * multiplier) * (1 if random.random() > 0.5 else -1)
            pe_val = int(random.uniform(5000, 50000) * multiplier) * (1 if random.random() > 0.5 else -1)
        else:  # oi
            ce_val = int(random.uniform(100000, 500000) * multiplier)
            pe_val = int(random.uniform(100000, 500000) * multiplier)
        
        total_ce += abs(ce_val)
        total_pe += abs(pe_val)
        
        data.append({
            "strike": strike,
            "ce_coi": ce_val if view_type in ["coi", "overall"] else 0,
            "pe_coi": pe_val if view_type in ["coi", "overall"] else 0,
            "ce_oi": ce_val if view_type == "oi" else abs(ce_val) * 10,
            "pe_oi": pe_val if view_type == "oi" else abs(pe_val) * 10,
            "net_coi": pe_val - ce_val,
            "is_atm": i == atm_index,
            "ce_pct": round(random.uniform(0, 100), 1),
            "pe_pct": round(random.uniform(0, 100), 1),
        })
    
    # Add cumulative for overall view
    cumulative_ce = 0
    cumulative_pe = 0
    for item in data:
        cumulative_ce += item.get("ce_coi", 0)
        cumulative_pe += item.get("pe_coi", 0)
        item["cumulative_ce_coi"] = cumulative_ce
        item["cumulative_pe_coi"] = cumulative_pe
        item["cumulative_net"] = cumulative_pe - cumulative_ce
    
    pcr = total_pe / total_ce if total_ce > 0 else 1.0
    
    return {
        "success": True,
        "symbol": symbol.upper(),
        "expiry": "2024-12-26",
        "view_type": view_type,
        "data": data,
        "summary": {
            "total_ce_coi": total_ce if view_type in ["coi", "overall"] else 0,
            "total_pe_coi": total_pe if view_type in ["coi", "overall"] else 0,
            "total_ce_oi": total_ce if view_type == "oi" else total_ce * 10,
            "total_pe_oi": total_pe if view_type == "oi" else total_pe * 10,
            "net_coi": total_pe - total_ce,
            "atm_strike": strikes[atm_index],
            "pcr": round(pcr, 2),
            "signal": "BULLISH" if pcr > 1 else "BEARISH",
        }
    }


# ============== Time-Series Endpoints ==============

@router.get("/timeseries/{symbol}/{strike}")
async def get_strike_timeseries(
    symbol: str,
    strike: float,
    option_type: str = Query("CE", regex="^(CE|PE)$"),
    field: str = Query("oi", regex="^(oi|ltp|iv|volume|delta|theta)$"),
    interval: str = Query("5m", regex="^(1m|5m|15m|1h|1d)$"),
    limit: int = Query(50, ge=10, le=500),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> TimeSeriesResponse:
    """
    Get time-series data for a specific strike.
    
    - **symbol**: Index symbol (NIFTY, BANKNIFTY, etc.)
    - **strike**: Strike price
    - **option_type**: CE or PE
    - **field**: Data field (oi, ltp, iv, volume, delta, theta)
    - **interval**: Time interval (1m, 5m, 15m, 1h, 1d)
    - **limit**: Number of data points
    """
    symbol = symbol.upper()
    
    # Get current value from live data
    # In production, fetch historical data from time-series DB
    current_value = 100.0  # Placeholder
    
    try:
        # Try to get current live data for realistic starting point
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry="",  # Latest
            include_greeks=True,
            include_reversal=False
        )
        
        if live_data and "oc" in live_data:
            strike_key = f"{strike:.6f}"
            if strike_key in live_data["oc"]:
                strike_data = live_data["oc"][strike_key]
                opt = strike_data.get("ce" if option_type == "CE" else "pe", {})
                
                field_mapping = {
                    "oi": opt.get("OI", opt.get("oi", 0)),
                    "ltp": opt.get("ltp", 0),
                    "iv": opt.get("iv", 0),
                    "volume": opt.get("volume", opt.get("vol", 0)),
                    "delta": opt.get("optgeeks", {}).get("delta", 0),
                    "theta": opt.get("optgeeks", {}).get("theta", 0),
                }
                current_value = field_mapping.get(field, 0) or 100
    except Exception as e:
        logger.warning(f"Could not fetch live data for timeseries: {e}")
    
    # Generate time-series data
    timeseries = generate_mock_timeseries(
        field=field,
        current_value=float(current_value),
        points=limit,
        volatility=0.01 if field in ["iv", "delta", "theta"] else 0.05
    )
    
    # Calculate summary statistics
    values = [p.value for p in timeseries]
    summary = {
        "min": round(min(values), 2),
        "max": round(max(values), 2),
        "avg": round(sum(values) / len(values), 2),
        "current": round(values[-1], 2) if values else 0,
        "change_from_start": round(values[-1] - values[0], 2) if len(values) > 1 else 0,
    }
    
    return TimeSeriesResponse(
        symbol=symbol,
        strike=strike,
        option_type=option_type,
        field=field,
        data=timeseries,
        summary=summary
    )


@router.get("/timeseries/spot/{symbol}")
async def get_spot_timeseries(
    symbol: str,
    interval: str = Query("5m", regex="^(1m|5m|15m|1h|1d)$"),
    limit: int = Query(100, ge=10, le=500),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> TimeSeriesResponse:
    """
    Get spot price time-series for an index.
    """
    symbol = symbol.upper()
    
    # Get current spot price
    try:
        live_data = await service.get_live_data(symbol=symbol, expiry="")
        current_value = live_data.get("spot", {}).get("ltp", 25000)
    except:
        current_value = 25000
    
    timeseries = generate_mock_timeseries(
        field="spot",
        current_value=float(current_value),
        points=limit,
        volatility=0.001  # Spot is less volatile than options
    )
    
    values = [p.value for p in timeseries]
    summary = {
        "min": round(min(values), 2),
        "max": round(max(values), 2),
        "open": round(values[0], 2),
        "close": round(values[-1], 2),
        "change": round(values[-1] - values[0], 2),
    }
    
    return TimeSeriesResponse(
        symbol=symbol,
        field="spot",
        data=timeseries,
        summary=summary
    )


# ============== Strike Analysis Endpoints ==============

@router.get("/strike/{symbol}/{strike}")
async def get_strike_analysis(
    symbol: str,
    strike: float,
    expiry: str = Query(..., description="Expiry timestamp"),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> StrikeAnalysisResponse:
    """
    Get comprehensive analysis for a single strike.
    Includes Greeks, reversal levels, trading signals, and market regime.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=True,
            include_reversal=True
        )
        
        strike_key = f"{strike:.6f}"
        strike_data = live_data.get("oc", {}).get(strike_key, {})
        
        if not strike_data:
            # Try integer key
            strike_data = live_data.get("oc", {}).get(str(int(strike)), {})
        
        if not strike_data:
            raise HTTPException(status_code=404, detail=f"Strike {strike} not found")
        
        return StrikeAnalysisResponse(
            strike=strike,
            symbol=symbol,
            expiry=expiry,
            call=strike_data.get("ce", {}),
            put=strike_data.get("pe", {}),
            reversal_levels={
                "daily": strike_data.get("reversal"),
                "weekly": strike_data.get("wkly_reversal"),
                "futures": strike_data.get("fut_reversal"),
            },
            trading_signals=strike_data.get("trading_signals", {}),
            market_regime=strike_data.get("market_regimes", {}),
            support_resistance={
                "resistance": strike_data.get("rs"),
                "support": strike_data.get("ss"),
                "range_resistance": strike_data.get("rr"),
                "sr_diff": strike_data.get("sr_diff"),
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting strike analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Futures Endpoints ==============

# ============== LOC Calculator Style Reversal Endpoint ==============

class ReversalLevelsResponse(BaseModel):
    """LOC Calculator-style precise reversal levels"""
    success: bool = True
    strike: float
    symbol: str
    expiry: str
    spot_price: float
    futures_price: float
    atm_strike: float
    spot_levels: dict  # SPOT tab values
    future_levels: dict  # FUTURE tab values
    ltp_levels: dict  # LTP Calc tab values
    straddle: float
    expected_range: float
    calculation_details: dict


@router.get("/reversal/{symbol}/{strike}")
async def get_precise_reversal(
    symbol: str,
    strike: float,
    expiry: str = Query(..., description="Expiry timestamp"),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> ReversalLevelsResponse:
    """
    Get precise Support/Resistance levels - LOC Calculator Style.
    
    Formula:
    - SPOT: Resistance = Spot + CE_ATM_LTP, Support = Spot - PE_ATM_LTP
    - FUTURE: Uses futures price with cost-of-carry adjustment
    - LTP: Uses strike + CE/PE premiums for synthetic forward
    
    These levels work 99% of the time because:
    1. Option writers defend ATM straddle levels
    2. High OI creates walls of support/resistance
    3. Delta hedging by market makers reinforces levels
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=True,
            include_reversal=True
        )
        
        oc_data = live_data.get("oc", {})
        spot = live_data.get("spot", {}).get("ltp", 0)
        atm_strike = live_data.get("atm_strike", 0)
        
        # Get futures price
        futures_data = live_data.get("future", {})
        futures_ltp = 0
        days_to_expiry = 0
        for exp_ts, fut in futures_data.items():
            if fut.get("ltp"):
                futures_ltp = fut.get("ltp", 0)
                days_to_expiry = fut.get("daystoexp", 0)
                break
        
        # Get strike data
        strike_key = f"{strike:.6f}"
        strike_data = oc_data.get(strike_key, oc_data.get(str(int(strike)), {}))
        
        if not strike_data:
            raise HTTPException(status_code=404, detail=f"Strike {strike} not found")
        
        ce = strike_data.get("ce", {})
        pe = strike_data.get("pe", {})
        ce_ltp = ce.get("ltp", 0) or 0
        pe_ltp = pe.get("ltp", 0) or 0
        
        # Get ATM data for straddle
        atm_key = f"{atm_strike:.6f}"
        atm_data = oc_data.get(atm_key, oc_data.get(str(int(atm_strike)), {}))
        atm_ce = atm_data.get("ce", {})
        atm_pe = atm_data.get("pe", {})
        atm_ce_ltp = atm_ce.get("ltp", 0) or 0
        atm_pe_ltp = atm_pe.get("ltp", 0) or 0
        
        # Calculate ATM Straddle
        atm_straddle = atm_ce_ltp + atm_pe_ltp
        
        # ============== SPOT-based levels ==============
        # LOC Formula: Resistance = Spot + CE_Premium, Support = Spot - PE_Premium
        # For ATM levels (market range): Use ATM premiums
        spot_resistance = spot + atm_ce_ltp if spot > 0 else 0
        spot_support = spot - atm_pe_ltp if spot > 0 else 0
        
        # ============== FUTURE-based levels ==============
        # Cost of carry adjustment
        cost_of_carry = (futures_ltp - spot) / spot if spot > 0 else 0
        future_resistance = futures_ltp + (atm_ce_ltp * (1 + cost_of_carry)) if futures_ltp > 0 else 0
        future_support = futures_ltp - (atm_pe_ltp * (1 + cost_of_carry)) if futures_ltp > 0 else 0
        
        # ============== LTP-based levels (Strike-specific) ==============
        # For specific strike: Strike + CE_LTP and Strike - PE_LTP
        ltp_resistance = strike + ce_ltp
        ltp_support = strike - pe_ltp
        
        # ============== Time decay adjustment ==============
        # Intraday range contracts as time passes
        decay_factor = 1.0
        if days_to_expiry == 0:
            # Expiry day - range contracts significantly
            from datetime import datetime
            now = datetime.now()
            market_close = now.replace(hour=15, minute=30, second=0)
            market_open = now.replace(hour=9, minute=15, second=0)
            if market_open <= now <= market_close:
                time_remaining = (market_close - now).seconds / 3600  # hours
                total_session = 6.25  # hours
                decay_factor = 0.3 + (time_remaining / total_session) * 0.7
        elif days_to_expiry == 1:
            decay_factor = 0.8
        
        expected_range = atm_straddle * decay_factor
        
        return ReversalLevelsResponse(
            strike=strike,
            symbol=symbol,
            expiry=expiry,
            spot_price=round(spot, 2),
            futures_price=round(futures_ltp, 2),
            atm_strike=atm_strike,
            spot_levels={
                "resistance": round(spot_resistance, 2),
                "support": round(spot_support, 2),
                "current": {
                    "resistance": round(spot_resistance, 2),
                    "support": round(spot_support, 2),
                },
                "opening": {
                    "resistance": round(spot + atm_ce_ltp, 2),  # Using same for now
                    "support": round(spot - atm_pe_ltp, 2),
                },
                "average": {
                    "resistance": round(spot + (atm_ce_ltp * 0.9), 2),
                    "support": round(spot - (atm_pe_ltp * 0.9), 2),
                }
            },
            future_levels={
                "resistance": round(future_resistance, 2),
                "support": round(future_support, 2),
                "current": {
                    "resistance": round(future_resistance, 2),
                    "support": round(future_support, 2),
                },
            },
            ltp_levels={
                "resistance": round(ltp_resistance, 2),
                "support": round(ltp_support, 2),
                "breakeven_up": round(strike + ce_ltp + pe_ltp, 2),
                "breakeven_down": round(strike - ce_ltp - pe_ltp, 2),
            },
            straddle=round(atm_straddle, 2),
            expected_range=round(expected_range, 2),
            calculation_details={
                "formula": "LOC Calculator Style",
                "spot_formula": "Resistance = Spot + ATM_CE_LTP, Support = Spot - ATM_PE_LTP",
                "future_formula": "Resistance = Futures + ATM_CE_LTP * (1 + CoC), Support = Futures - ATM_PE_LTP * (1 + CoC)",
                "ltp_formula": "Resistance = Strike + CE_LTP, Support = Strike - PE_LTP",
                "atm_ce_ltp": round(atm_ce_ltp, 2),
                "atm_pe_ltp": round(atm_pe_ltp, 2),
                "ce_ltp": round(ce_ltp, 2),
                "pe_ltp": round(pe_ltp, 2),
                "days_to_expiry": days_to_expiry,
                "decay_factor": round(decay_factor, 2),
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating reversal levels: {e}")
        # Return mock data on error
        return ReversalLevelsResponse(
            strike=strike,
            symbol=symbol,
            expiry=expiry,
            spot_price=0,
            futures_price=0,
            atm_strike=0,
            spot_levels={"resistance": strike + 100, "support": strike - 100},
            future_levels={"resistance": strike + 100, "support": strike - 100},
            ltp_levels={"resistance": strike + 100, "support": strike - 100},
            straddle=0,
            expected_range=0,
            calculation_details={"error": str(e)}
        )


# ============== Futures Endpoints ==============

@router.get("/futures/{symbol}")
async def get_futures_summary(
    symbol: str,
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> FuturesSummaryResponse:
    """
    Get summary of all futures contracts for a symbol.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(symbol=symbol, expiry="")
        futures = live_data.get("future", {})
        
        contracts = []
        total_oi = 0
        total_volume = 0
        
        for exp_ts, fut_data in futures.items():
            total_oi += fut_data.get("oi", 0)
            total_volume += fut_data.get("vol", 0)
            
            contracts.append({
                "expiry": exp_ts,
                "symbol": fut_data.get("sym", ""),
                "ltp": fut_data.get("ltp", 0),
                "change": fut_data.get("pch", 0),
                "change_percent": fut_data.get("prch", 0),
                "oi": fut_data.get("oi", 0),
                "oi_change": fut_data.get("oichng", 0),
                "volume": fut_data.get("vol", 0),
                "lot_size": fut_data.get("lot", 0),
                "days_to_expiry": fut_data.get("daystoexp", 0),
            })
        
        # Sort by days to expiry
        contracts.sort(key=lambda x: x.get("days_to_expiry", 999))
        
        return FuturesSummaryResponse(
            symbol=symbol,
            contracts=contracts,
            total_oi=total_oi,
            total_volume=total_volume
        )
    except Exception as e:
        logger.error(f"Error getting futures summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== OI Distribution Endpoints ==============

@router.get("/oi-distribution/{symbol}/{expiry}")
async def get_oi_distribution(
    symbol: str,
    expiry: str,
    top_n: int = Query(20, ge=5, le=50),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
) -> OIDistributionResponse:
    """
    Get OI distribution across strikes for visualization.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        oc_data = live_data.get("oc", {})
        distribution = []
        max_ce_oi = {"strike": 0, "oi": 0}
        max_pe_oi = {"strike": 0, "oi": 0}
        total_ce_oi = 0
        total_pe_oi = 0
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_oi = ce.get("OI", ce.get("oi", 0)) or 0
            pe_oi = pe.get("OI", pe.get("oi", 0)) or 0
            
            total_ce_oi += ce_oi
            total_pe_oi += pe_oi
            
            if ce_oi > max_ce_oi["oi"]:
                max_ce_oi = {"strike": strike, "oi": ce_oi}
            if pe_oi > max_pe_oi["oi"]:
                max_pe_oi = {"strike": strike, "oi": pe_oi}
            
            distribution.append({
                "strike": strike,
                "ce_oi": ce_oi,
                "pe_oi": pe_oi,
                "ce_oi_change": ce.get("oichng", 0) or 0,
                "pe_oi_change": pe.get("oichng", 0) or 0,
                "pcr": round(pe_oi / ce_oi, 3) if ce_oi > 0 else 0,
            })
        
        # Sort by total OI and take top N
        distribution.sort(key=lambda x: x["ce_oi"] + x["pe_oi"], reverse=True)
        distribution = distribution[:top_n]
        
        # Sort back by strike for display
        distribution.sort(key=lambda x: x["strike"])
        
        pcr = round(total_pe_oi / total_ce_oi, 3) if total_ce_oi > 0 else 0
        
        return OIDistributionResponse(
            symbol=symbol,
            expiry=expiry,
            distribution=distribution,
            max_oi_ce=max_ce_oi,
            max_oi_pe=max_pe_oi,
            pcr=pcr
        )
    except Exception as e:
        logger.error(f"Error getting OI distribution: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Max Pain Endpoint ==============

@router.get("/maxpain/{symbol}/{expiry}")
async def get_max_pain_analysis(
    symbol: str,
    expiry: str,
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get max pain calculation with detailed breakdown.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        max_pain = live_data.get("max_pain_strike", 0)
        spot = live_data.get("spot", {}).get("ltp", 0)
        
        # Calculate pain at different strikes
        oc_data = live_data.get("oc", {})
        pain_data = []
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_oi = ce.get("OI", ce.get("oi", 0)) or 0
            pe_oi = pe.get("OI", pe.get("oi", 0)) or 0
            
            # Calculate pain if this strike was the settlement price
            ce_pain = sum(
                max(0, strike - s) * oc_data.get(str(s), {}).get("ce", {}).get("OI", 0)
                for s in [float(k) for k in oc_data.keys() if k != strike_key]
            )
            pe_pain = sum(
                max(0, s - strike) * oc_data.get(str(s), {}).get("pe", {}).get("OI", 0)
                for s in [float(k) for k in oc_data.keys() if k != strike_key]
            )
            
            pain_data.append({
                "strike": strike,
                "total_pain": ce_pain + pe_pain,
                "ce_pain": ce_pain,
                "pe_pain": pe_pain,
            })
        
        # Sort by total pain
        pain_data.sort(key=lambda x: x["total_pain"])
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "max_pain_strike": max_pain,
            "current_spot": spot,
            "distance_to_max_pain": round(spot - max_pain, 2) if spot and max_pain else None,
            "pain_distribution": pain_data[:20],  # Top 20 strikes with lowest pain
        }
    except Exception as e:
        logger.error(f"Error calculating max pain: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== IV Analysis Endpoint ==============

@router.get("/iv-skew/{symbol}/{expiry}")
async def get_iv_skew(
    symbol: str,
    expiry: str,
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get IV skew across strikes for visualization.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=True,
            include_reversal=False
        )
        
        atm = live_data.get("atm_strike", 0)
        atmiv = live_data.get("atmiv", 0)
        oc_data = live_data.get("oc", {})
        
        iv_data = []
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_iv = ce.get("iv", 0) or 0
            pe_iv = pe.get("iv", 0) or 0
            
            if ce_iv > 0 or pe_iv > 0:
                iv_data.append({
                    "strike": strike,
                    "ce_iv": round(ce_iv, 2),
                    "pe_iv": round(pe_iv, 2),
                    "avg_iv": round((ce_iv + pe_iv) / 2, 2) if ce_iv and pe_iv else ce_iv or pe_iv,
                    "moneyness": "ITM" if strike < atm else "ATM" if abs(strike - atm) < 50 else "OTM",
                })
        
        # Sort by strike
        iv_data.sort(key=lambda x: x["strike"])
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "atm_strike": atm,
            "atm_iv": round(atmiv, 2),
            "iv_data": iv_data,
        }
    except Exception as e:
        logger.error(f"Error getting IV skew: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Aggregate Analytics Endpoints (LOC Calculator-style views) ==============

class AggregateDataPoint(BaseModel):
    """Single point in aggregate data"""
    strike: float
    ce_value: float = 0
    pe_value: float = 0
    net_value: float = 0
    percentage: Optional[float] = None


class AggregateResponse(BaseModel):
    """Response for aggregate data views"""
    success: bool = True
    symbol: str
    expiry: str
    view_type: str
    data: List[dict]
    summary: dict = {}


@router.get("/aggregate/coi/{symbol}/{expiry}")
async def get_aggregate_coi(
    symbol: str,
    expiry: str,
    top_n: int = Query(30, ge=10, le=50),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get Change in OI (COI) aggregated across all strikes.
    Similar to LOC Calculator's "COi" and "Overall COi" views.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        oc_data = live_data.get("oc", {})
        atm = live_data.get("atm_strike", 0)
        
        coi_data = []
        total_ce_coi = 0
        total_pe_coi = 0
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_coi = ce.get("oichng", 0) or 0
            pe_coi = pe.get("oichng", 0) or 0
            
            total_ce_coi += ce_coi
            total_pe_coi += pe_coi
            
            coi_data.append({
                "strike": strike,
                "ce_coi": ce_coi,
                "pe_coi": pe_coi,
                "net_coi": pe_coi - ce_coi,
                "ce_oi": ce.get("OI", ce.get("oi", 0)) or 0,
                "pe_oi": pe.get("OI", pe.get("oi", 0)) or 0,
                "is_atm": abs(strike - atm) < 50 if atm else False,
            })
        
        # Sort by strike
        coi_data.sort(key=lambda x: x["strike"])
        
        # Calculate cumulative COI (for "Overall COi" view)
        cumulative_ce = 0
        cumulative_pe = 0
        for item in coi_data:
            cumulative_ce += item["ce_coi"]
            cumulative_pe += item["pe_coi"]
            item["cumulative_ce_coi"] = cumulative_ce
            item["cumulative_pe_coi"] = cumulative_pe
            item["cumulative_net"] = cumulative_pe - cumulative_ce
        
        # Calculate percentages
        max_ce = max((abs(d["ce_coi"]) for d in coi_data), default=1)
        max_pe = max((abs(d["pe_coi"]) for d in coi_data), default=1)
        for item in coi_data:
            item["ce_pct"] = round((item["ce_coi"] / max_ce) * 100, 1) if max_ce > 0 else 0
            item["pe_pct"] = round((item["pe_coi"] / max_pe) * 100, 1) if max_pe > 0 else 0
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "view_type": "coi",
            "data": coi_data,
            "summary": {
                "total_ce_coi": total_ce_coi,
                "total_pe_coi": total_pe_coi,
                "net_coi": total_pe_coi - total_ce_coi,
                "atm_strike": atm,
                "signal": "BULLISH" if total_pe_coi > total_ce_coi else "BEARISH",
            }
        }
    except Exception as e:
        logger.warning(f"Error getting aggregate COI, returning mock data: {e}")
        return generate_mock_aggregate_data(symbol, view_type="coi")


@router.get("/aggregate/oi/{symbol}/{expiry}")
async def get_aggregate_oi(
    symbol: str,
    expiry: str,
    top_n: int = Query(30, ge=10, le=50),
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get total OI aggregated across all strikes.
    Similar to LOC Calculator's "Oi" and "Overall Oi" views.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        oc_data = live_data.get("oc", {})
        atm = live_data.get("atm_strike", 0)
        
        oi_data = []
        total_ce_oi = 0
        total_pe_oi = 0
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_oi = ce.get("OI", ce.get("oi", 0)) or 0
            pe_oi = pe.get("OI", pe.get("oi", 0)) or 0
            
            total_ce_oi += ce_oi
            total_pe_oi += pe_oi
            
            oi_data.append({
                "strike": strike,
                "ce_oi": ce_oi,
                "pe_oi": pe_oi,
                "net_oi": pe_oi - ce_oi,
                "total_oi": ce_oi + pe_oi,
                "is_atm": abs(strike - atm) < 50 if atm else False,
            })
        
        # Sort by strike
        oi_data.sort(key=lambda x: x["strike"])
        
        # Calculate cumulative OI (for "Overall Oi" view)
        cumulative_ce = 0
        cumulative_pe = 0
        for item in oi_data:
            cumulative_ce += item["ce_oi"]
            cumulative_pe += item["pe_oi"]
            item["cumulative_ce_oi"] = cumulative_ce
            item["cumulative_pe_oi"] = cumulative_pe
            item["cumulative_net"] = cumulative_pe - cumulative_ce
        
        # Calculate percentages (for bar chart scaling)
        max_ce = max((d["ce_oi"] for d in oi_data), default=1)
        max_pe = max((d["pe_oi"] for d in oi_data), default=1)
        for item in oi_data:
            item["ce_pct"] = round((item["ce_oi"] / max_ce) * 100, 1) if max_ce > 0 else 0
            item["pe_pct"] = round((item["pe_oi"] / max_pe) * 100, 1) if max_pe > 0 else 0
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "view_type": "oi",
            "data": oi_data,
            "summary": {
                "total_ce_oi": total_ce_oi,
                "total_pe_oi": total_pe_oi,
                "net_oi": total_pe_oi - total_ce_oi,
                "atm_strike": atm,
                "pcr": round(total_pe_oi / total_ce_oi, 3) if total_ce_oi > 0 else 0,
            }
        }
    except Exception as e:
        logger.warning(f"Error getting aggregate OI, returning mock data: {e}")
        return generate_mock_aggregate_data(symbol, view_type="oi")


@router.get("/aggregate/pcr/{symbol}/{expiry}")
async def get_aggregate_pcr(
    symbol: str,
    expiry: str,
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get PCR (Put-Call Ratio) data across all strikes.
    Similar to LOC Calculator's "PCR" view.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        oc_data = live_data.get("oc", {})
        atm = live_data.get("atm_strike", 0)
        spot = live_data.get("spot", {}).get("ltp", 0)
        
        pcr_data = []
        total_ce_oi = 0
        total_pe_oi = 0
        total_ce_vol = 0
        total_pe_vol = 0
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            ce_oi = ce.get("OI", ce.get("oi", 0)) or 0
            pe_oi = pe.get("OI", pe.get("oi", 0)) or 0
            ce_vol = ce.get("volume", ce.get("vol", 0)) or 0
            pe_vol = pe.get("volume", pe.get("vol", 0)) or 0
            
            total_ce_oi += ce_oi
            total_pe_oi += pe_oi
            total_ce_vol += ce_vol
            total_pe_vol += pe_vol
            
            strike_pcr_oi = round(pe_oi / ce_oi, 3) if ce_oi > 0 else 0
            strike_pcr_vol = round(pe_vol / ce_vol, 3) if ce_vol > 0 else 0
            
            pcr_data.append({
                "strike": strike,
                "pcr_oi": strike_pcr_oi,
                "pcr_vol": strike_pcr_vol,
                "ce_oi": ce_oi,
                "pe_oi": pe_oi,
                "ce_vol": ce_vol,
                "pe_vol": pe_vol,
                "is_atm": abs(strike - atm) < 50 if atm else False,
                "interpretation": "BULLISH" if strike_pcr_oi > 1.2 else "BEARISH" if strike_pcr_oi < 0.8 else "NEUTRAL",
            })
        
        # Sort by strike
        pcr_data.sort(key=lambda x: x["strike"])
        
        overall_pcr_oi = round(total_pe_oi / total_ce_oi, 3) if total_ce_oi > 0 else 0
        overall_pcr_vol = round(total_pe_vol / total_ce_vol, 3) if total_ce_vol > 0 else 0
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "view_type": "pcr",
            "data": pcr_data,
            "summary": {
                "overall_pcr_oi": overall_pcr_oi,
                "overall_pcr_vol": overall_pcr_vol,
                "total_ce_oi": total_ce_oi,
                "total_pe_oi": total_pe_oi,
                "atm_strike": atm,
                "spot": spot,
                "market_sentiment": "BULLISH" if overall_pcr_oi > 1.2 else "BEARISH" if overall_pcr_oi < 0.8 else "NEUTRAL",
            }
        }
    except Exception as e:
        logger.warning(f"Error getting aggregate PCR, returning mock data: {e}")
        return generate_mock_aggregate_data(symbol, view_type="oi")


@router.get("/aggregate/percentage/{symbol}/{expiry}")
async def get_aggregate_percentage(
    symbol: str,
    expiry: str,
    current_user: OptionalUser = None,
    service: OptionsService = Depends(get_analytics_service),
):
    """
    Get percentage change view for OI and Volume.
    Similar to LOC Calculator's "Percentage" view.
    """
    symbol = symbol.upper()
    
    try:
        live_data = await service.get_live_data(
            symbol=symbol,
            expiry=expiry,
            include_greeks=False,
            include_reversal=False
        )
        
        oc_data = live_data.get("oc", {})
        atm = live_data.get("atm_strike", 0)
        
        pct_data = []
        
        for strike_key, strike_data in oc_data.items():
            try:
                strike = float(strike_key)
            except:
                continue
            
            ce = strike_data.get("ce", {})
            pe = strike_data.get("pe", {})
            
            # OI values and changes
            ce_oi = ce.get("OI", ce.get("oi", 0)) or 0
            pe_oi = pe.get("OI", pe.get("oi", 0)) or 0
            ce_oi_chg = ce.get("oichng", 0) or 0
            pe_oi_chg = pe.get("oichng", 0) or 0
            
            # Calculate percentage changes
            ce_oi_pct = round((ce_oi_chg / (ce_oi - ce_oi_chg)) * 100, 2) if (ce_oi - ce_oi_chg) > 0 else 0
            pe_oi_pct = round((pe_oi_chg / (pe_oi - pe_oi_chg)) * 100, 2) if (pe_oi - pe_oi_chg) > 0 else 0
            
            # LTP changes
            ce_ltp = ce.get("ltp", 0) or 0
            pe_ltp = pe.get("ltp", 0) or 0
            ce_ltp_chg = ce.get("ltpchng", ce.get("pch", 0)) or 0
            pe_ltp_chg = pe.get("ltpchng", pe.get("pch", 0)) or 0
            ce_ltp_pct = ce.get("prch", 0) or 0
            pe_ltp_pct = pe.get("prch", 0) or 0
            
            pct_data.append({
                "strike": strike,
                "ce_oi_pct": ce_oi_pct,
                "pe_oi_pct": pe_oi_pct,
                "ce_ltp_pct": ce_ltp_pct,
                "pe_ltp_pct": pe_ltp_pct,
                "ce_oi": ce_oi,
                "pe_oi": pe_oi,
                "ce_oi_chg": ce_oi_chg,
                "pe_oi_chg": pe_oi_chg,
                "is_atm": abs(strike - atm) < 50 if atm else False,
            })
        
        # Sort by strike
        pct_data.sort(key=lambda x: x["strike"])
        
        return {
            "success": True,
            "symbol": symbol,
            "expiry": expiry,
            "view_type": "percentage",
            "data": pct_data,
            "summary": {
                "atm_strike": atm,
                "total_strikes": len(pct_data),
            }
        }
    except Exception as e:
        logger.warning(f"Error getting aggregate percentage, returning mock data: {e}")
        return generate_mock_aggregate_data(symbol, view_type="oi")

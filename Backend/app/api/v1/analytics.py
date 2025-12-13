"""
Analytics API Endpoints
Time-series, charts, and historical data for option chain analysis
"""
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentUser
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


# ============== Time-Series Endpoints ==============

@router.get("/timeseries/{symbol}/{strike}")
async def get_strike_timeseries(
    symbol: str,
    strike: float,
    option_type: str = Query("CE", regex="^(CE|PE)$"),
    field: str = Query("oi", regex="^(oi|ltp|iv|volume|delta|theta)$"),
    interval: str = Query("5m", regex="^(1m|5m|15m|1h|1d)$"),
    limit: int = Query(50, ge=10, le=500),
    current_user: CurrentUser = None,
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
    current_user: CurrentUser = None,
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
    current_user: CurrentUser = None,
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

@router.get("/futures/{symbol}")
async def get_futures_summary(
    symbol: str,
    current_user: CurrentUser = None,
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
    current_user: CurrentUser = None,
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
    current_user: CurrentUser = None,
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
    current_user: CurrentUser = None,
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

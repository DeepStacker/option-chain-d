"""
WebSocket Event Handlers
Handles WebSocket connections and live data streaming
"""
import logging
import asyncio
from uuid import uuid4

from fastapi import WebSocket, WebSocketDisconnect, Depends

from app.api.websocket.manager import manager
from app.services.dhan_client import DhanClient
from app.services.options import OptionsService
from app.cache.redis import get_redis_connection, RedisCache
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Active streaming tasks
_streaming_tasks: dict = {}


async def websocket_endpoint(websocket: WebSocket):
    """
    Main WebSocket endpoint handler.
    Handles connection, subscription, and live data streaming.
    """
    client_id = str(uuid4())
    
    # Accept connection
    if not await manager.connect(websocket, client_id):
        return
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            message_type = data.get("type", "")
            
            if message_type == "subscribe":
                await handle_subscribe(client_id, data)
                
            elif message_type == "unsubscribe":
                await handle_unsubscribe(client_id)
                
            elif message_type == "ping":
                await manager.send_personal_message(
                    {"type": "pong"},
                    client_id
                )
            
    except WebSocketDisconnect:
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
    finally:
        # Cleanup
        await handle_unsubscribe(client_id)
        await manager.disconnect(client_id)


async def handle_subscribe(client_id: str, data: dict):
    """
    Handle subscription request.
    Starts live data streaming for the client.
    """
    symbol = data.get("sid", data.get("symbol", "NIFTY")).upper()
    expiry = data.get("exp_sid", data.get("expiry", ""))
    
    if not expiry:
        await manager.send_personal_message(
            {"type": "error", "message": "Expiry is required"},
            client_id
        )
        return
    
    # Subscribe client
    await manager.subscribe(client_id, symbol, expiry)
    
    # Start streaming if not already running for this group
    group_key = f"{symbol}:{expiry}"
    
    if group_key not in _streaming_tasks or _streaming_tasks[group_key].done():
        task = asyncio.create_task(
            stream_live_data(symbol, expiry)
        )
        _streaming_tasks[group_key] = task
        logger.info(f"Started streaming task for {group_key}")


async def handle_unsubscribe(client_id: str):
    """
    Handle unsubscription request.
    Stops streaming if no more subscribers.
    """
    subscription = manager.get_subscription(client_id)
    
    if subscription:
        await manager.unsubscribe(client_id)
        
        # Check if streaming should stop
        group_key = f"{subscription.symbol}:{subscription.expiry}"
        
        if group_key in manager.subscription_groups:
            if not manager.subscription_groups[group_key]:
                # No more subscribers, cancel streaming task
                if group_key in _streaming_tasks:
                    _streaming_tasks[group_key].cancel()
                    del _streaming_tasks[group_key]
                    logger.info(f"Stopped streaming task for {group_key}")


async def stream_live_data(symbol: str, expiry: str):
    """
    Stream live data to all subscribers of a symbol/expiry.
    Runs continuously until cancelled.
    """
    group_key = f"{symbol}:{expiry}"
    interval = settings.WS_BROADCAST_INTERVAL
    
    # Create service instances
    try:
        redis_client = await get_redis_connection()
        cache = RedisCache(redis_client)
        dhan = DhanClient(cache=cache)
        options_service = OptionsService(dhan_client=dhan, cache=cache)
    except Exception as e:
        logger.error(f"Failed to initialize services for streaming: {e}")
        return
    
    logger.info(f"Streaming started for {group_key}")
    
    try:
        while True:
            # Check if there are still subscribers
            if group_key not in manager.subscription_groups:
                break
            
            if not manager.subscription_groups[group_key]:
                break
            
            try:
                # Fetch and process live data
                data = await options_service.get_live_data(
                    symbol=symbol,
                    expiry=expiry,
                    include_greeks=True,
                    include_reversal=True
                )
                
                # Broadcast to all subscribers
                await manager.broadcast_to_group(symbol, expiry, data)
                
            except Exception as e:
                logger.error(f"Error fetching data for {group_key}: {e}")
                
                # Send error to clients
                await manager.broadcast_to_group(
                    symbol, expiry,
                    {"type": "error", "message": str(e)}
                )
            
            # Wait for next interval
            await asyncio.sleep(interval)
            
    except asyncio.CancelledError:
        logger.info(f"Streaming cancelled for {group_key}")
    finally:
        # Cleanup
        await dhan.close()
        logger.info(f"Streaming stopped for {group_key}")


async def get_streaming_status() -> dict:
    """Get status of all streaming tasks"""
    status = {}
    
    for group_key, task in _streaming_tasks.items():
        status[group_key] = {
            "running": not task.done(),
            "subscribers": len(manager.subscription_groups.get(group_key, set()))
        }
    
    return {
        "total_connections": manager.connection_count,
        "total_subscriptions": manager.subscription_count,
        "streams": status
    }

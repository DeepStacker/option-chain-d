"""
WebSocket Connection Manager
Handles WebSocket connections and broadcasting
"""
import logging
import asyncio
from typing import Dict, Set, Optional
from dataclasses import dataclass, field

from fastapi import WebSocket
import msgpack

logger = logging.getLogger(__name__)


@dataclass
class ClientSubscription:
    """Client subscription info"""
    websocket: WebSocket
    symbol: str
    expiry: str
    active: bool = True


class ConnectionManager:
    """
    WebSocket connection manager.
    Handles client connections, subscriptions, and broadcasting.
    """
    
    def __init__(self):
        # Active connections: client_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        
        # Client subscriptions: client_id -> subscription info
        self.subscriptions: Dict[str, ClientSubscription] = {}
        
        # Symbol/Expiry based groups for efficient broadcasting
        # key: "symbol:expiry" -> set of client_ids
        self.subscription_groups: Dict[str, Set[str]] = {}
        
        # Lock for thread-safe operations
        self._lock = asyncio.Lock()
    
    async def connect(self, websocket: WebSocket, client_id: str) -> bool:
        """
        Accept and register a new WebSocket connection.
        
        Args:
            websocket: WebSocket connection
            client_id: Unique client identifier
            
        Returns:
            True if connection accepted
        """
        try:
            await websocket.accept()
            
            async with self._lock:
                self.active_connections[client_id] = websocket
            
            logger.info(f"Client connected: {client_id}")
            
            # Send connection confirmation
            await self.send_personal_message(
                {"type": "connected", "client_id": client_id},
                client_id
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Connection error for {client_id}: {e}")
            return False
    
    async def disconnect(self, client_id: str) -> None:
        """
        Disconnect and cleanup a client.
        
        Args:
            client_id: Client identifier
        """
        async with self._lock:
            # Remove from active connections
            self.active_connections.pop(client_id, None)
            
            # Remove subscription
            sub = self.subscriptions.pop(client_id, None)
            
            if sub:
                # Remove from subscription group
                group_key = f"{sub.symbol}:{sub.expiry}"
                if group_key in self.subscription_groups:
                    self.subscription_groups[group_key].discard(client_id)
                    if not self.subscription_groups[group_key]:
                        del self.subscription_groups[group_key]
        
        logger.info(f"Client disconnected: {client_id}")
    
    async def subscribe(
        self,
        client_id: str,
        symbol: str,
        expiry: str
    ) -> bool:
        """
        Subscribe a client to symbol/expiry live data.
        
        Args:
            client_id: Client identifier
            symbol: Trading symbol
            expiry: Expiry timestamp
            
        Returns:
            True if subscribed successfully
        """
        async with self._lock:
            websocket = self.active_connections.get(client_id)
            if not websocket:
                return False
            
            # Remove from previous subscription group
            old_sub = self.subscriptions.get(client_id)
            if old_sub:
                old_key = f"{old_sub.symbol}:{old_sub.expiry}"
                if old_key in self.subscription_groups:
                    self.subscription_groups[old_key].discard(client_id)
            
            # Create new subscription
            self.subscriptions[client_id] = ClientSubscription(
                websocket=websocket,
                symbol=symbol.upper(),
                expiry=expiry,
                active=True
            )
            
            # Add to new subscription group
            group_key = f"{symbol.upper()}:{expiry}"
            if group_key not in self.subscription_groups:
                self.subscription_groups[group_key] = set()
            self.subscription_groups[group_key].add(client_id)
        
        logger.info(f"Client {client_id} subscribed to {symbol}:{expiry}")
        
        # Send confirmation
        await self.send_personal_message(
            {
                "type": "subscribed",
                "symbol": symbol.upper(),
                "expiry": expiry
            },
            client_id
        )
        
        return True
    
    async def unsubscribe(self, client_id: str) -> bool:
        """
        Unsubscribe a client from live data.
        
        Args:
            client_id: Client identifier
            
        Returns:
            True if unsubscribed successfully
        """
        async with self._lock:
            sub = self.subscriptions.pop(client_id, None)
            
            if sub:
                group_key = f"{sub.symbol}:{sub.expiry}"
                if group_key in self.subscription_groups:
                    self.subscription_groups[group_key].discard(client_id)
        
        if sub:
            logger.info(f"Client {client_id} unsubscribed")
            await self.send_personal_message(
                {"type": "unsubscribed"},
                client_id
            )
            return True
        
        return False
    
    async def send_personal_message(
        self,
        message: dict,
        client_id: str,
        use_msgpack: bool = False
    ) -> bool:
        """
        Send a message to a specific client.
        
        Args:
            message: Message to send
            client_id: Target client
            use_msgpack: Use msgpack encoding
            
        Returns:
            True if sent successfully
        """
        websocket = self.active_connections.get(client_id)
        if not websocket:
            return False
        
        try:
            if use_msgpack:
                await websocket.send_bytes(msgpack.packb(message))
            else:
                await websocket.send_json(message)
            return True
        except Exception as e:
            logger.warning(f"Failed to send to {client_id}: {e}")
            await self.disconnect(client_id)
            return False
    
    async def broadcast_to_group(
        self,
        symbol: str,
        expiry: str,
        data: dict
    ) -> int:
        """
        Broadcast data to all clients subscribed to a symbol/expiry.
        
        Args:
            symbol: Trading symbol
            expiry: Expiry timestamp
            data: Data to broadcast
            
        Returns:
            Number of clients sent to
        """
        group_key = f"{symbol.upper()}:{expiry}"
        
        async with self._lock:
            clients = self.subscription_groups.get(group_key, set()).copy()
        
        if not clients:
            return 0
        
        # Encode once for all clients
        packed_data = msgpack.packb(data)
        sent_count = 0
        disconnected = []
        
        for client_id in clients:
            websocket = self.active_connections.get(client_id)
            if websocket:
                try:
                    await websocket.send_bytes(packed_data)
                    sent_count += 1
                except Exception as e:
                    logger.warning(f"Broadcast error for {client_id}: {e}")
                    disconnected.append(client_id)
        
        # Cleanup disconnected clients
        for client_id in disconnected:
            await self.disconnect(client_id)
        
        return sent_count
    
    async def broadcast_all(self, message: dict) -> int:
        """
        Broadcast a message to all connected clients.
        
        Args:
            message: Message to broadcast
            
        Returns:
            Number of clients sent to
        """
        async with self._lock:
            clients = list(self.active_connections.items())
        
        sent_count = 0
        
        for client_id, websocket in clients:
            try:
                await websocket.send_json(message)
                sent_count += 1
            except Exception:
                pass
        
        return sent_count
    
    def get_subscription(self, client_id: str) -> Optional[ClientSubscription]:
        """Get client's current subscription"""
        return self.subscriptions.get(client_id)
    
    def get_active_subscriptions(self) -> Dict[str, Set[str]]:
        """Get all active subscription groups"""
        return dict(self.subscription_groups)
    
    @property
    def connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.active_connections)
    
    @property
    def subscription_count(self) -> int:
        """Get number of active subscriptions"""
        return len(self.subscriptions)


# Global connection manager instance
manager = ConnectionManager()

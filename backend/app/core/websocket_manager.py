from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        self.active_connections = {}

    async def connect(
        self,
        user_id,
        websocket: WebSocket
    ):

        await websocket.accept()

        self.active_connections[
            str(user_id)
        ] = websocket

    def disconnect(
        self,
        user_id
    ):

        self.active_connections.pop(
            str(user_id),
            None
        )

    async def send_notification(
        self,
        user_id,
        message
    ):

        websocket = (
            self.active_connections.get(
                str(user_id)
            )
        )

        if websocket:

            await websocket.send_json({
                "notification":
                message
            })


manager = ConnectionManager()
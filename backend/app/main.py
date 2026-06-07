from fastapi import FastAPI

from app.core.database import Base, engine
from app.api.auth.route import router as auth_router

from app.api.groups.routes import (
    router as group_router
)

from app.api.expenses.routes import(
    router as expense_router
)

from app.api.notifications.routes import (
    router as notification_router
)

from app.api.websocket.routes import router as websocket_router

from app.api.payments.routes import router as payment_router

from app.api.dashboard.routes import router as dashboard_router

from fastapi.middleware.cors import CORSMiddleware

from app.models import *

Base.metadata.create_all(bind=engine)


app = FastAPI()


app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],  # Adjust this in production
    allow_methods=["*"],    
    allow_headers=["*"],
    allow_credentials=True
)

app.include_router(auth_router)


app.include_router(group_router)
app.include_router(expense_router)
app.include_router(notification_router)
app.include_router(websocket_router)
app.include_router(payment_router)
app.include_router(dashboard_router)
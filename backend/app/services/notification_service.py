from app.models.notifications import (
    Notification
)

from fastapi import HTTPException

from app.core.websocket_manager import manager

import asyncio


def create_notification(
    user_id,
    title,
    message,
    db
):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message
    )

    db.add(notification)

    try:
        asyncio.create_task(
            manager.send_notification(
                user_id,
                {
                    "title": title,
                    "message": message
                }
            )
        )

    except:
        pass

def get_notifications(
    current_user,
    db
):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id
        == current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return notifications


def mark_as_read(
    notification_id,
    current_user,
    db
):

    notification = db.query(
        Notification
    ).filter(
        Notification.id
        == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    notification.is_read = True

    db.commit()

    return {
        "message":
        "Notification marked as read"
    }
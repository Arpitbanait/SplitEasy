from fastapi import HTTPException

from app.models.payment import (
    Payment
)

from app.models.balance import (
    Balance
)

from app.services.notification_service import (
    create_notification
)


def make_payment(
    payment_data,
    current_user,
    db
):

    balance = db.query(
        Balance
    ).filter(
        Balance.group_id ==
        payment_data.group_id,

        Balance.owed_by ==
        current_user.id,

        Balance.owed_to ==
        payment_data.receiver_id
    ).first()

    if not balance:
        raise HTTPException(
            status_code=404,
            detail="No balance found"
        )

    if payment_data.amount > balance.amount:
        raise HTTPException(
            status_code=400,
            detail="Amount exceeds debt"
        )

    payment = Payment(
        payer_id=
        current_user.id,

        receiver_id=
        payment_data.receiver_id,

        group_id=
        payment_data.group_id,

        amount=
        payment_data.amount
    )

    db.add(payment)

    # settle balance
    balance.amount -= (
        payment_data.amount
    )

    if balance.amount <= 0:
        db.delete(balance)

    # notification
    create_notification(
        payment_data.receiver_id,
        "Payment Received",
        f"{current_user.full_name} paid ₹{payment_data.amount}",
        db
    )

    db.commit()

    return {
        "message":
        "Payment successful"
    }


def get_payment_history(
    current_user,
    db
):

    payments = db.query(
        Payment
    ).filter(

        (
            Payment.payer_id
            == current_user.id
        )

        |

        (
            Payment.receiver_id
            == current_user.id
        )

    ).order_by(
        Payment.created_at.desc()
    ).all()

    response = []

    for payment in payments:

        response.append({

            "id":
            payment.id,

            "payer_name":
            payment.payer.full_name,

            "receiver_name":
            payment.receiver.full_name,

            "amount":
            payment.amount,

            "payment_status":
            payment.payment_status,

            "created_at":
            payment.created_at
        })

    return response
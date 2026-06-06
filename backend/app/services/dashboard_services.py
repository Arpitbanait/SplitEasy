from sqlalchemy import func

from app.models.groups import (
    Group
)

from app.models.expenses import (
    Expense
)

from app.models.balance import (
    Balance
)

from app.models.payment import (
    Payment
)

from app.models.notifications import (
    Notification
)


def get_dashboard(
    current_user,
    db
):

    # total groups
    total_groups = len(
        current_user.groups
    )

    # total expenses paid
    total_expenses = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.paid_by
        == current_user.id
    ).scalar()

    # money user owes
    you_owe = db.query(
        func.sum(Balance.amount)
    ).filter(
        Balance.owed_by
        == current_user.id
    ).scalar()

    # money others owe user
    you_are_owed = db.query(
        func.sum(Balance.amount)
    ).filter(
        Balance.owed_to
        == current_user.id
    ).scalar()

    # payment history count
    recent_payments = db.query(
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

    ).count()

    # unread notifications
    pending_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id
            == current_user.id,

            Notification.is_read
            == False
        )
        .count()
    )

    return {

        "total_groups":
        total_groups,

        "total_expenses":
        total_expenses or 0,

        "you_owe":
        you_owe or 0,

        "you_are_owed":
        you_are_owed or 0,

        "recent_payments":
        recent_payments,

        "pending_notifications":
        pending_notifications
    }
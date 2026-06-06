from app.models.groups import Group
from app.models.users import User

from fastapi import HTTPException

from app.services.notification_service import create_notification

from app.services.notification_service import create_notification

def create_group(
    group_data,
    current_user,
    db
):

    group = Group(
        group_name=group_data.group_name,
        created_by=current_user.id
    )

    group.members.append(current_user)

    db.add(group)
    db.commit()
    db.refresh(group)

    return group


def get_my_groups(
    current_user,
    db
):
    return current_user.groups


def add_member(
    group_id,
    email,
    db
):

    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise Exception(
            "User not found"
        )

    group.members.append(user)

    create_notification(
    user.id,
    "Added to Group",
    f"You were added to {group.group_name}",
    db
)

    db.commit()

    return {
        "message":
        "Member added successfully"
    }



def get_group_details(
    group_id,
    current_user,
    db
):

    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return group

from sqlalchemy import func

from app.models.expenses import Expense
from app.models.balance import Balance


def get_group_summary(
    group_id,
    current_user,
    db
):

    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    total_expenses = db.query(
        func.sum(Expense.amount)
    ).filter(
        Expense.group_id == group_id
    ).scalar()

    balances = db.query(Balance).filter(
        Balance.group_id == group_id
    ).all()

    balance_response = []

    for balance in balances:

        balance_response.append({
            "from":
            balance.debtor.full_name,

            "to":
            balance.creditor.full_name,

            "amount":
            balance.amount
        })

    return {
        "group_name":
        group.group_name,

        "total_members":
        len(group.members),

        "total_expenses":
        total_expenses or 0,

        "balances":
        balance_response
    }


from collections import defaultdict

from app.models.balance import (
    Balance
)


def simplify_debts(
    group_id,
    current_user,
    db
):

    group = db.query(Group).filter(
        Group.id == group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    balances = db.query(
        Balance
    ).filter(
        Balance.group_id
        == group_id
    ).all()

    # net balance map
    net_balance = defaultdict(float)

    for balance in balances:

        net_balance[
            str(balance.owed_by)
        ] -= balance.amount

        net_balance[
            str(balance.owed_to)
        ] += balance.amount

    debtors = []
    creditors = []

    # separate debtors & creditors
    for user_id, amount in (
        net_balance.items()
    ):

        if amount < 0:

            debtors.append([
                user_id,
                abs(amount)
            ])

        elif amount > 0:

            creditors.append([
                user_id,
                amount
            ])

    simplified = []

    i = 0
    j = 0

    while (
        i < len(debtors)
        and
        j < len(creditors)
    ):

        debtor_id, debt = (
            debtors[i]
        )

        creditor_id, credit = (
            creditors[j]
        )

        settled_amount = min(
            debt,
            credit
        )

        debtor = db.query(User).filter(
            User.id == debtor_id
        ).first()

        creditor = db.query(User).filter(
            User.id == creditor_id
        ).first()

        simplified.append({

            "from":
            debtor.full_name,

            "to":
            creditor.full_name,

            "amount":
            round(
                settled_amount,
                2
            )
        })

        debtors[i][1] -= (
            settled_amount
        )

        creditors[j][1] -= (
            settled_amount
        )

        if debtors[i][1] == 0:
            i += 1

        if creditors[j][1] == 0:
            j += 1

    return simplified

from fastapi import HTTPException

from app.models.expenses import Expense
from app.models.balance import Balance
from app.models.groups import Group
from app.models.expense_participant import ExpenseParticipant
from app.models.users import User
from app.services.notification_service import create_notification

def create_expense(
    expense_data,
    current_user,
    db
):

    # Check if group exists
    group = db.query(Group).filter(
        Group.id == expense_data.group_id
    ).first()

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found"
        )

    # Check if current user belongs to group
    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="You are not member of this group"
        )

    # Get selected participants
    participants = db.query(User).filter(
        User.id.in_(
            expense_data.participants
        )
    ).all()

    if len(participants) == 0:
        raise HTTPException(
            status_code=400,
            detail="No participants selected"
        )

    # Validate all participants belong to group
    group_member_ids = {
        member.id
        for member in group.members
    }

    for participant in participants:
        if participant.id not in group_member_ids:
            raise HTTPException(
                status_code=400,
                detail=f"{participant.full_name} is not in group"
            )

    # Create expense
    expense = Expense(
        group_id=expense_data.group_id,
        paid_by=current_user.id,
        amount=expense_data.amount,
        description=expense_data.description
    )

    db.add(expense)

    # Generate expense ID before commit
    db.flush()

    # Equal split amount
    split_amount = (
        expense_data.amount
        / len(participants)
    )

    for participant in participants:

        # Save participant share
        expense_participant = (
            ExpenseParticipant(
                expense_id=expense.id,
                user_id=participant.id,
                share_amount=split_amount
            )
        )

        db.add(expense_participant)

        # Skip payer
        if participant.id == current_user.id:
            continue

        # Check existing balance
        balance = db.query(Balance).filter(
            Balance.group_id == group.id,
            Balance.owed_by == participant.id,
            Balance.owed_to == current_user.id
        ).first()

        # Update existing balance
        if balance:
            balance.amount += split_amount

        # Create new balance
        else:
            new_balance = Balance(
                group_id=group.id,
                owed_by=participant.id,
                owed_to=current_user.id,
                amount=split_amount
            )

            db.add(new_balance)


    for participant in participants:

     if participant.id != current_user.id:

        create_notification(
            participant.id,
            "New Expense Added",
            f"{current_user.full_name} added ₹{expense.amount} for {expense.description}",
            db
        )
        

    db.commit()

    db.refresh(expense)

    return {
        "message":
        "Expense added successfully",

        "expense_id":
        str(expense.id),

        "split_amount":
        split_amount
    }




def get_group_balances(
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

    balances = db.query(Balance).filter(
        Balance.group_id == group_id
    ).all()

    response = []

    for balance in balances:

        response.append({
            "from_user":
            balance.debtor.full_name,

            "to_user":
            balance.creditor.full_name,

            "amount":
            balance.amount
        })

    return response



def get_group_expenses(
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

    expenses = db.query(Expense).filter(
        Expense.group_id == group_id
    ).order_by(
        Expense.created_at.desc()
    ).all()

    response = []

    for expense in expenses:

        response.append({
            "id": expense.id,
            "description":
            expense.description,

            "amount":
            expense.amount,

            "paid_by":
            expense.payer.full_name,

            "created_at":
            expense.created_at
        })

    return response


def settle_up(
    settlement_data,
    current_user,
    db
):

    balance = db.query(Balance).filter(
        Balance.group_id ==
        settlement_data.group_id,

        Balance.owed_by ==
        current_user.id,

        Balance.owed_to ==
        settlement_data.receiver_id
    ).first()

    if not balance:
        raise HTTPException(
            status_code=404,
            detail="No balance found"
        )

    if settlement_data.amount > balance.amount:
        raise HTTPException(
            status_code=400,
            detail="Amount exceeds debt"
        )

    balance.amount -= (
        settlement_data.amount
    )

    if balance.amount == 0:
        db.delete(balance)

    create_notification(
    settlement_data.receiver_id,
    "Settlement Received",
    f"{current_user.full_name} settled ₹{settlement_data.amount} with you",
    db
)    

    db.commit()

    return {
        "message":
        "Settlement successful"
    }



def delete_expense(
    expense_id,
    current_user,
    db
):

    expense = db.query(
        Expense
    ).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    group = db.query(Group).filter(
        Group.id == expense.group_id
    ).first()

    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    participants = db.query(
        ExpenseParticipant
    ).filter(
        ExpenseParticipant.expense_id
        == expense.id
    ).all()

    # reverse balances
    for participant in participants:

        if participant.user_id == expense.paid_by:
            continue

        balance = db.query(
            Balance
        ).filter(
            Balance.group_id ==
            expense.group_id,

            Balance.owed_by ==
            participant.user_id,

            Balance.owed_to ==
            expense.paid_by
        ).first()

        if balance:

            balance.amount -= (
                participant.share_amount
            )

            # remove if zero
            if balance.amount <= 0:
                db.delete(balance)

    db.delete(expense)

    for participant in participants:

      if participant.user_id != current_user.id:

        create_notification(
            participant.user_id,
            "Expense Deleted",
            f"{current_user.full_name} deleted an expense",
            db
        )

    db.commit()

    return {
        "message":
        "Expense deleted successfully"
    }



def update_expense(
    expense_id,
    expense_data,
    current_user,
    db
):

    expense = db.query(
        Expense
    ).filter(
        Expense.id == expense_id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    group = db.query(Group).filter(
        Group.id == expense.group_id
    ).first()

    if current_user not in group.members:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    old_participants = db.query(
        ExpenseParticipant
    ).filter(
        ExpenseParticipant.expense_id
        == expense.id
    ).all()

    # reverse old balances
    for participant in old_participants:

        if participant.user_id == expense.paid_by:
            continue

        balance = db.query(
            Balance
        ).filter(
            Balance.group_id ==
            expense.group_id,

            Balance.owed_by ==
            participant.user_id,

            Balance.owed_to ==
            expense.paid_by
        ).first()

        if balance:

            balance.amount -= (
                participant.share_amount
            )

            if balance.amount <= 0:
                db.delete(balance)

    # remove old participants
    db.query(
        ExpenseParticipant
    ).filter(
        ExpenseParticipant.expense_id
        == expense.id
    ).delete()

    # update expense
    expense.amount = (
        expense_data.amount
    )

    expense.description = (
        expense_data.description
    )

    participants = db.query(
        User
    ).filter(
        User.id.in_(
            expense_data.participants
        )
    ).all()

    split_amount = (
        expense_data.amount
        / len(participants)
    )

    # apply new balances
    for participant in participants:

        new_participant = (
            ExpenseParticipant(
                expense_id=
                expense.id,

                user_id=
                participant.id,

                share_amount=
                split_amount
            )
        )

        db.add(new_participant)

        if participant.id == expense.paid_by:
            continue

        balance = db.query(
            Balance
        ).filter(
            Balance.group_id ==
            expense.group_id,

            Balance.owed_by ==
            participant.id,

            Balance.owed_to ==
            expense.paid_by
        ).first()

        if balance:
            balance.amount += (
                split_amount
            )

        else:
            db.add(
                Balance(
                    group_id=
                    expense.group_id,

                    owed_by=
                    participant.id,

                    owed_to=
                    expense.paid_by,

                    amount=
                    split_amount
                )
            )

    for participant in participants:

     if participant.id != current_user.id:

        create_notification(
            participant.id,
            "Expense Updated",
            f"{current_user.full_name} updated expense '{expense.description}'",
            db
        )        

    db.commit()

    return {
        "message":
        "Expense updated successfully"
    }
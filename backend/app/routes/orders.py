from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderOut

router = APIRouter(prefix='/orders', tags=['orders'])


@router.get('', response_model=list[OrderOut])
def list_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

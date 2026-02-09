from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.cart import Cart
from app.models.order import Order, OrderItem
from app.models.user import User
from app.services.stripe_service import build_line_items

router = APIRouter(prefix='/checkout', tags=['checkout'])


@router.post('/session')
def create_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail='Cart is empty')

    total_amount = Decimal('0.00')
    line_items = []
    for item in cart.items:
        product = item.product
        line_items.append(
            {
                'product_id': product.id,
                'name': product.name,
                'price': str(product.price),
                'quantity': item.quantity,
            }
        )
        total_amount += Decimal(product.price) * item.quantity

    order = Order(
        user_id=current_user.id,
        total_amount=Decimal('0.00'),
        payment_status='paid',
        stripe_session_id=None,
    )
    db.add(order)
    db.flush()

    for item in cart.items:
        price = Decimal(item.product.price)
        total_amount += price * item.quantity
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            price=price,
            quantity=item.quantity,
        )
        db.add(order_item)

    order.total_amount = total_amount

    for item in list(cart.items):
        db.delete(item)

    db.commit()

    return {
        'order_id': order.id,
        'total_amount': str(order.total_amount),
        'line_items': build_line_items(line_items),
        'status': 'paid',
    }


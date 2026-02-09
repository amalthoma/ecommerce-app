from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemOut, CartItemUpdate, CartOut

router = APIRouter(prefix='/cart', tags=['cart'])


def _get_or_create_cart(db: Session, user: User) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _build_cart_response(cart: Cart) -> CartOut:
    items: list[CartItemOut] = []
    total = Decimal('0.00')
    for item in cart.items:
        product = item.product
        line_total = Decimal(product.price) * item.quantity
        total += line_total
        items.append(
            CartItemOut(
                id=item.id,
                product_id=product.id,
                quantity=item.quantity,
                product_name=product.name,
                product_price=Decimal(product.price),
                image_url=product.image_url,
            )
        )
    return CartOut(id=cart.id, items=items, total_amount=total)


@router.get('', response_model=CartOut)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, current_user)
    db.refresh(cart)
    return _build_cart_response(cart)


@router.post('/add', response_model=CartOut)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, current_user)
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')

    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id)
        .first()
    )
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product.id, quantity=payload.quantity)
        db.add(item)
    db.commit()
    db.refresh(cart)
    return _build_cart_response(cart)


@router.put('/update', response_model=CartOut)
def update_cart_item(
    payload: CartItemUpdate,
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, current_user)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Cart item not found')
    if payload.quantity < 1:
        db.delete(item)
    else:
        item.quantity = payload.quantity
    db.commit()
    db.refresh(cart)
    return _build_cart_response(cart)


@router.delete('/remove/{item_id}', response_model=CartOut)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = _get_or_create_cart(db, current_user)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Cart item not found')
    db.delete(item)
    db.commit()
    db.refresh(cart)
    return _build_cart_response(cart)

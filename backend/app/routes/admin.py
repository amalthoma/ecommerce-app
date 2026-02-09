from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.models.order import Order
from app.models.product import Product
from app.schemas.order import OrderOut
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix='/admin', tags=['admin'])


@router.post('/products', response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put('/products/{product_id}', response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete('/products/{product_id}')
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    db.delete(product)
    db.commit()
    return {'status': 'deleted'}


@router.get('/orders', response_model=list[OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.put('/orders/{order_id}', response_model=OrderOut)
def update_order_status(
    order_id: int,
    status_value: str,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail='Order not found')
    order.payment_status = status_value
    db.commit()
    db.refresh(order)
    return order

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.models.product import Product
from app.schemas.product import ProductOut

router = APIRouter(prefix='/products', tags=['products'])


@router.get('', response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.created_at.desc()).all()


@router.get('/{product_id}', response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    return product

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    image_url: str | None = None
    stock: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    stock: int | None = None


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

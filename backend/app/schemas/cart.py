from pydantic import BaseModel, ConfigDict
from decimal import Decimal


class CartItemBase(BaseModel):
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    product_name: str
    product_price: Decimal
    image_url: str | None = None


class CartOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    items: list[CartItemOut]
    total_amount: Decimal

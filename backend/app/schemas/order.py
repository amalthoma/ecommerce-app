from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    price: Decimal
    quantity: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    total_amount: Decimal
    payment_status: str
    stripe_session_id: str | None = None
    created_at: datetime
    items: list[OrderItemOut]

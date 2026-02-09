from pydantic import BaseModel, EmailStr

from app.schemas.user import UserOut


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routes import admin, auth, cart, checkout, orders, products

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.project_name)




origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ecommerce-app-blue-kappa.vercel.app",  # your frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(checkout.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get('/')
def health_check():
    return {'status': 'ok'}

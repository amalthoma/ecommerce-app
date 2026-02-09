from decimal import Decimal
import sys
from pathlib import Path

# Allow importing "app.*" when running from repo root via `python -m backend.scripts.seed`
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.product import Product
from app.models.user import User

ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'admin123'

SAMPLE_PRODUCTS = [
    {
        'name': 'Minimal Desk Lamp',
        'description': 'Warm ambient light with adjustable neck.',
        'price': Decimal('2499.00'),
        'image_url': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
        'stock': 12,
    },
    {
        'name': 'Ergonomic Chair',
        'description': 'Supportive mesh with adjustable lumbar.',
        'price': Decimal('12999.00'),
        'image_url': 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f',
        'stock': 6,
    },
    {
        'name': 'Oak Coffee Table',
        'description': 'Solid oak with a matte finish.',
        'price': Decimal('8999.00'),
        'image_url': 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103',
        'stock': 4,
    },
]


def main():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=ADMIN_EMAIL,
                password_hash=get_password_hash(ADMIN_PASSWORD),
                is_admin=True,
            )
            db.add(admin)
            print(f'Created admin user: {ADMIN_EMAIL} / {ADMIN_PASSWORD}')
        else:
            if not admin.is_admin:
                admin.is_admin = True
                print(f'Updated user to admin: {ADMIN_EMAIL}')

        if db.query(Product).count() == 0:
            for payload in SAMPLE_PRODUCTS:
                db.add(Product(**payload))
            print('Seeded sample products.')
        else:
            print('Products already exist; skipping product seed.')

        db.commit()
    finally:
        db.close()


if __name__ == '__main__':
    main()

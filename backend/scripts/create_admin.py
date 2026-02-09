import os
import sys
from pathlib import Path

# Allow importing "app.*" when running from repo root via `python -m backend.scripts.create_admin`
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User


def main():
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not email or not password:
        raise SystemExit("ADMIN_EMAIL and ADMIN_PASSWORD must be set.")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == email).first()
        if not admin:
            admin = User(
                email=email,
                password_hash=get_password_hash(password),
                is_admin=True,
            )
            db.add(admin)
            print(f"Created admin user: {email}")
        else:
            admin.is_admin = True
            admin.password_hash = get_password_hash(password)
            print(f"Updated admin user: {email}")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()

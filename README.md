# Ecommerce FastAPI + React

## Backend

Create `backend/.env` using `backend/.env.example`.

Run locally:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn app.main:app --reload
```

## Frontend

Create `frontend/.env` using `frontend/.env.example`.

```powershell
cd frontend
npm install
npm run dev
```

## Payments

- This demo uses an instant "paid" flow: clicking Checkout creates the order and clears the cart.

## Deployment

Backend (Render, free):

1. Push this repo to GitHub.
2. In Render, create a **Web Service**.
3. Use `backend` as Root Directory.
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
6. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

Frontend (Vercel): connect repo and set `VITE_API_URL` to your Render URL.

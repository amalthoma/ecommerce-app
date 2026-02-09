import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import CheckoutSuccess from './pages/CheckoutSuccess'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

const App = () => {
  const { token, logout, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/products" className="font-display text-xl tracking-tight">
            CommerceStack
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/products" className="hover:text-accent">Products</Link>
            <Link to="/cart" className="hover:text-accent">Cart</Link>
            {isAdmin && (
              <>
                <Link to="/admin/products" className="hover:text-accent">Admin Products</Link>
                <Link to="/admin/orders" className="hover:text-accent">Admin Orders</Link>
              </>
            )}
            {!token ? (
              <Link to="/login" className="rounded-full bg-ink px-4 py-2 text-white">Login</Link>
            ) : (
              <button onClick={logout} className="rounded-full border border-ink px-4 py-2">
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout-success"
            element={
              <ProtectedRoute>
                <CheckoutSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Products />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

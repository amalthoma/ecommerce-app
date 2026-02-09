import { useEffect, useState } from 'react'
import api from '../api'

const Cart = () => {
  const [cart, setCart] = useState(null)

  const loadCart = () => {
    api.get('/cart').then((res) => setCart(res.data))
  }

  useEffect(() => {
    loadCart()
  }, [])

  const updateItem = async (itemId, quantity) => {
    await api.put('/cart/update', { quantity }, { params: { item_id: itemId } })
    loadCart()
  }

  const removeItem = async (itemId) => {
    await api.delete(`/cart/remove/${itemId}`)
    loadCart()
  }

  const checkout = async () => {
    await api.post('/checkout/session')
    window.location.href = '/checkout-success'
  }

  if (!cart) return <p>Loading...</p>

  return (
    <div>
      <h1 className="font-display text-3xl">Your cart</h1>
      <div className="mt-6 space-y-4">
        {cart.items.length === 0 && <p className="text-ink/60">Cart is empty.</p>}
        {cart.items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.product_name}</h3>
                <p className="text-sm text-ink/60">${item.product_price}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, Number(e.target.value))}
                  className="w-16 rounded-lg border border-ink/20 px-2 py-1"
                />
                <button className="text-sm text-red-600" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="text-xl font-semibold">Total: ${cart.total_amount}</span>
        <button
          className="rounded-full bg-ink px-6 py-3 text-white disabled:opacity-40"
          onClick={checkout}
          disabled={cart.items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart

import { useEffect, useState } from 'react'
import api from '../api'

const CheckoutSuccess = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data))
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl">Payment confirmed</h1>
      <p className="mt-2 text-ink/70">Your order has been created by the Stripe webhook.</p>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-ink/60">Status: {order.payment_status}</p>
              </div>
              <div className="text-lg font-semibold">${order.total_amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckoutSuccess

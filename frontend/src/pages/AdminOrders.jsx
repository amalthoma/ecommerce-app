import { useEffect, useState } from 'react'
import api from '../api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])

  const loadOrders = () => {
    api.get('/admin/orders').then((res) => setOrders(res.data))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}`, null, { params: { status_value: status } })
    loadOrders()
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Admin orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-ink/60">Total: ${order.total_amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.payment_status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="rounded-lg border border-ink/20 px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="fulfilled">fulfilled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrders

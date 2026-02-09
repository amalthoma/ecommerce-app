import { useEffect, useState } from 'react'
import api from '../api'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  stock: 0
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)

  const loadProducts = () => {
    api.get('/products').then((res) => setProducts(res.data))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await api.post('/admin/products', {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    })
    setForm(emptyForm)
    loadProducts()
  }

  const updateStock = async (id, stock) => {
    await api.put(`/admin/products/${id}`, { stock: Number(stock) })
    loadProducts()
  }

  const removeProduct = async (id) => {
    await api.delete(`/admin/products/${id}`)
    loadProducts()
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Admin products</h1>
      <form className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-ink/20 px-4 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="rounded-xl border border-ink/20 px-4 py-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <input
          className="rounded-xl border border-ink/20 px-4 py-2"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <textarea
          className="rounded-xl border border-ink/20 px-4 py-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex items-center gap-4">
          <input
            className="w-24 rounded-xl border border-ink/20 px-4 py-2"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <button className="rounded-full bg-ink px-6 py-2 text-white">Create</button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-ink/60">${product.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => updateStock(product.id, e.target.value)}
                  className="w-20 rounded-lg border border-ink/20 px-2 py-1"
                />
                <button className="text-sm text-red-600" onClick={() => removeProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProducts

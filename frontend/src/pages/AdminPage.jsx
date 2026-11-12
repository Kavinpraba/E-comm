import { useEffect, useState } from 'react';
import { ArrowUpRight, Package, Pencil, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { api } from '../services/api.js';
import './AdminPage.css';

const blankProduct = { name: '', description: '', category: 'Home', image: '', price: '', stock: '', rating: '4.8', featured: false };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const loadData = async () => {
    try {
      const [{ products: allProducts }, { orders: allOrders }] = await Promise.all([
        api('/products'), api('/orders'),
      ]);
      setProducts(allProducts);
      setOrders(allOrders);
      setError('');
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { loadData(); }, []);

  function edit(product) {
    setEditingId(product._id);
    setForm({ ...product, price: String(product.price), stock: String(product.stock), rating: String(product.rating) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const body = {
      name: form.name,
      description: form.description,
      category: form.category,
      image: form.image,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      featured: Boolean(form.featured),
    };
    try {
      await api(editingId ? `/products/${editingId}` : '/products', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      });
      setForm(blankProduct);
      setEditingId(null);
      setNotice(editingId ? 'Your changes are saved.' : 'A new good thing has been added.');
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function remove(product) {
    if (!window.confirm(`Remove "${product.name}" from the collection?`)) return;
    try {
      await api(`/products/${product._id}`, { method: 'DELETE' });
      setNotice('Product removed.');
      await loadData();
    } catch (err) { setError(err.message); }
  }

  return <div className="admin-page page-shell"><div className="admin-heading"><div><span className="eyebrow">THE NORTHSTAR STUDIO</span><h1>A little behind<br /><em>the scenes.</em></h1></div><span className="admin-seal">✳<small>ADMIN<br />STUDIO</small></span></div>
    <div className="admin-tabs"><button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={16} /> The collection <span>{products.length}</span></button><button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={16} /> Orders <span>{orders.length}</span></button></div>
    {error && <div className="form-error admin-notice">{error}</div>}{notice && <div className="admin-success">{notice}</div>}
    {activeTab === 'products' ? <div className="admin-content"><form className="admin-form" onSubmit={submit}><div className="admin-form-title"><span className="eyebrow">{editingId ? 'A LITTLE UPDATE' : 'ADD SOMETHING LOVELY'}</span><button type="button" className="admin-clear" onClick={() => { setForm(blankProduct); setEditingId(null); }}><X size={14} /> Clear</button></div><h2>{editingId ? 'Edit this good thing.' : 'A new favorite, perhaps?'}</h2><label>Product name<input required maxLength="120" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Short description<textarea required maxLength="2000" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Image URL<input required type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" /></label><div className="admin-form-row"><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Home', 'Accessories', 'Wellness', 'Stationery'].map((category) => <option key={category}>{category}</option>)}</select></label><label>Price ($)<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label></div><div className="admin-form-row"><label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label><label>Rating<input required type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></label></div><label className="featured-check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature this on the home page</label><button className="button button-dark admin-save" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Add to the collection'} {editingId ? <Pencil size={15} /> : <Plus size={16} />}</button></form>
      <div className="admin-product-list"><div className="admin-list-heading"><div><span className="eyebrow">CURRENTLY ON THE SHELVES</span><h2>The collection</h2></div><span>{products.length} lovely things</span></div>{products.length ? products.map((product) => <article className="admin-product-row" key={product._id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.category} · {product.stock} in stock</span></div><b>${Number(product.price).toFixed(2)}</b><button aria-label={`Edit ${product.name}`} onClick={() => edit(product)}><Pencil size={15} /></button><button aria-label={`Delete ${product.name}`} onClick={() => remove(product)}><Trash2 size={15} /></button></article>) : <div className="admin-empty">Your collection is waiting for its first favorite.</div>}</div></div> : <div className="admin-orders"><div className="admin-list-heading"><div><span className="eyebrow">THE GOOD THINGS, ON THEIR WAY</span><h2>Customer orders</h2></div><span>{orders.length} orders</span></div>{orders.length ? orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-head"><div><span className="eyebrow">ORDER · {order._id.slice(-8).toUpperCase()}</span><strong>{order.shippingAddress.name}</strong><span>{order.user?.email} · {new Date(order.createdAt).toLocaleDateString()}</span></div><span className={`order-status order-${order.status}`}>{order.status}</span></div><div className="order-card-items">{order.items.map((item) => <span key={item.product}>{item.name} <i>× {item.quantity}</i></span>)}</div><div className="order-card-bottom"><span>{order.shippingAddress.address} · {order.shippingAddress.phone}</span><strong>${Number(order.total).toFixed(2)} <small>· COD</small></strong></div></article>) : <div className="admin-empty">No orders yet. The first is always a little special.</div>}</div>}
  </div>;
}

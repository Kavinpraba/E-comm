import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, syncing, syncError, retrySync } = useCart();
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const shipping = subtotal >= 75 ? 0 : 7.5;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { order } = await api('/orders', { method: 'POST', body: JSON.stringify(form) });
      clearCart();
      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (!items.length) return <div className="empty-state checkout-empty"><PackageCheck size={30} /><h1>Your bag is all checked out.</h1><p>There’s nothing to deliver just yet.</p><Link to="/shop" className="button button-dark">Find something lovely <ArrowRight size={15} /></Link></div>;
  return (
    <div className="checkout-page page-shell">
      <Link className="back-link" to="/cart"><ArrowLeft size={15} /> Back to your bag</Link>
      <div className="checkout-heading"><span className="eyebrow">THE LAST LITTLE STEP</span><h1>Let’s get it<br /><em>to your door.</em></h1></div>
      <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><div className="checkout-form-head"><span>01</span><div><h2>Where should we send it?</h2><p>Just the essentials, and we’ll take it from here.</p></div></div>
        <label>Full name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="The name on your door" /></label>
        <label>Delivery address<textarea required autoComplete="street-address" rows="3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Street, city, and postcode" /></label>
        <label>Phone number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+1 (555) 000-0000" /></label>
        <div className="payment-choice"><span className="payment-dot"><Check size={12} /></span><div><strong>Cash on delivery</strong><span>Pay when your good things arrive. No fuss.</span></div><span className="payment-tag">NO PREPAYMENT</span></div>
        {syncError && <div className="form-error checkout-sync-error">{syncError}<button type="button" onClick={retrySync}>Try syncing your bag again</button></div>}
        {error && <div className="form-error">{error}</div>}
        <button className="button button-dark place-order" disabled={submitting || syncing || Boolean(syncError)}>{submitting ? 'Making it happen…' : syncing ? 'Getting your bag ready…' : 'Place your order'} <ArrowRight size={16} /></button>
        <p className="checkout-terms">By placing your order, you agree that good things are on their way.</p>
      </form>
      <aside className="checkout-summary"><span className="eyebrow">YOUR GOOD THINGS</span><h2>Order summary</h2>{items.map((item) => <div className="checkout-line" key={item._id}><div className="checkout-thumb"><img src={item.image} alt="" /><span>{item.quantity}</span></div><div><strong>{item.name}</strong><span>{item.category}</span></div><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}<div className="checkout-math"><div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'On us'}</span></div><div className="checkout-total"><strong>Total</strong><strong>${(subtotal + shipping).toFixed(2)}</strong></div></div><p className="checkout-love">A thoughtful parcel, packed with a little care. <span>✳</span></p></aside></div>
    </div>
  );
}

export function CheckoutSuccessPage() {
  return <div className="success-page page-shell"><span className="success-icon"><Check size={25} /></span><span className="eyebrow">ORDER PLACED WITH LOVE</span><h1>Good things<br /><em>are on their way.</em></h1><p>Thank you for making room for something lovely. Your order is in, and we can’t wait for it to find its new home.</p><Link className="button button-dark" to="/shop">Find another favorite <ArrowRight size={16} /></Link></div>;
}

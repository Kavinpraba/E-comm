import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, subtotal, changeQuantity, removeItem, syncError, retrySync } = useCart();
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 7.5;
  return (
    <div className="cart-page page-shell">
      <div className="cart-heading"><span className="eyebrow">YOUR LITTLE COLLECTION</span><h1>Your bag<span>.</span></h1><p>Good things, nearly yours.</p></div>
      {!items.length ? <div className="empty-cart"><span className="empty-bag-icon"><ShoppingBag size={27} /></span><span className="eyebrow">IT’S A LITTLE QUIET IN HERE</span><h2>Your bag is waiting<br />for something lovely.</h2><p>Take a look around. You might find your new everyday favorite.</p><Link className="button button-dark" to="/shop">Explore the collection <ArrowRight size={16} /></Link></div> :
        <div className="cart-layout"><div className="cart-items">{syncError && <div className="cart-sync-error">{syncError}<button onClick={retrySync}>Try again</button></div>}<div className="cart-items-head"><span>Item details</span><span>Quantity</span><span>Total</span></div>
          {items.map((item) => <article className="cart-item" key={item._id}><Link to={`/product/${item._id}`} className="cart-item-image"><img src={item.image} alt={item.name} /></Link><div className="cart-item-info"><span>{item.category}</span><Link to={`/product/${item._id}`}>{item.name}</Link><strong>${Number(item.price).toFixed(2)}</strong><button className="remove-item" onClick={() => removeItem(item._id)}><Trash2 size={13} /> Remove</button></div><div className="cart-quantity"><button aria-label="Decrease quantity" onClick={() => changeQuantity(item._id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label="Increase quantity" disabled={item.quantity >= item.stock} onClick={() => changeQuantity(item._id, 1)}><Plus size={13} /></button></div><strong className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</strong></article>)}
          <Link className="back-to-shop" to="/shop"><ArrowLeft size={14} /> Keep looking around</Link>
        </div><aside className="order-summary"><span className="eyebrow">THE LITTLE DETAILS</span><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'On us' : `$${shipping.toFixed(2)}`}</span></div>{subtotal < 75 && <p className="shipping-hint">You’re ${(75 - subtotal).toFixed(2)} away from complimentary shipping.</p>}<div className="summary-total"><span>Total</span><strong>${(subtotal + shipping).toFixed(2)}</strong></div><Link className="button button-dark checkout-button" to="/checkout">Make it yours <ArrowRight size={16} /></Link><p className="secure-note">A safe, happy checkout. Pay with cash when it arrives.</p></aside></div>}
    </div>
  );
}

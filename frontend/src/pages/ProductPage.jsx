import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api(`/products/${id}`)
      .then(({ product: found }) => setProduct(found))
      .catch((err) => setError(err.message));
  }, [id]);

  function addToBag() {
    try {
      for (let index = 0; index < quantity; index += 1) addItem(product);
      setNotice('Added to your bag — a lovely choice.');
    } catch (err) {
      setNotice(err.message);
    }
  }

  if (error) return <div className="empty-state"><h1>We couldn’t find that one.</h1><p>{error}</p><Link className="text-link" to="/shop">Back to the collection <ArrowRight size={15} /></Link></div>;
  if (!product) return <div className="loading-state">Finding that good thing…</div>;

  return (
    <div className="product-detail page-shell">
      <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back to the good things</button>
      <div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name} /><span className="detail-image-note">A LITTLE SOMETHING LOVELY&nbsp; ✳</span></div>
        <div className="detail-copy"><span className="eyebrow">{product.category} · CONSIDERED GOODS</span><h1>{product.name}</h1><div className="detail-rating"><span><Star size={14} fill="currentColor" /> {Number(product.rating).toFixed(1)}</span><i /> Thoughtfully picked by us</div><div className="detail-price">${Number(product.price).toFixed(2)}</div><p className="detail-description">{product.description}</p><div className={`stock-status ${product.stock < 1 ? 'out-of-stock' : ''}`}><span />{product.stock > 0 ? `${product.stock < 6 ? `Only ${product.stock} left` : 'In stock'} — ready to make your day` : 'Currently out of stock'}</div>
          <div className="detail-purchase"><div className="quantity-picker"><button disabled={quantity <= 1} aria-label="Decrease quantity" onClick={() => setQuantity((value) => value - 1)}><Minus size={14} /></button><span>{quantity}</span><button disabled={quantity >= product.stock} aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button></div><button className="button button-dark detail-add" disabled={product.stock < 1} onClick={addToBag}>Add to bag — ${(product.price * quantity).toFixed(2)} <ArrowRight size={16} /></button><button className="favorite-button" aria-label="Save to favorites"><Heart size={18} /></button></div>
          {notice && <div className="detail-notice"><Check size={15} /> {notice}</div>}
          <div className="detail-perks"><div><Truck size={18} /><span><strong>A little trip, on us</strong>Free shipping over $75</span></div><div><ShieldCheck size={18} /><span><strong>Here for the long run</strong>Thoughtfully chosen to last</span></div></div>
          <div className="detail-footnote">Good things are even better when they’re made with care. We choose every piece with the everyday in mind.</div>
        </div>
      </div>
    </div>
  );
}

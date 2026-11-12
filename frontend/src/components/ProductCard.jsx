import { ArrowUpRight, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const add = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try { addItem(product); } catch (error) { window.alert(error.message); }
  };
  return (
    <article className="product-card" style={{ '--card-index': index }}>
      <Link to={`/product/${product._id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && <span className="product-badge">A favorite</span>}
        <button className="quick-add" onClick={add} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={16} /><span>Add to bag</span></button>
        <span className="product-open"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-meta"><span>{product.category}</span><span className="product-rating"><Star size={12} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)}</span></div>
      <Link to={`/product/${product._id}`} className="product-name">{product.name}</Link>
      <span className="product-price">${Number(product.price).toFixed(2)}</span>
    </article>
  );
}

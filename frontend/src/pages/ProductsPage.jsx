import { useEffect, useState } from 'react';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import './ProductsPage.css';

const categoryList = ['All', 'Home', 'Accessories', 'Wellness', 'Stationery'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'featured';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (sort === 'price-asc' || sort === 'price-desc') params.set('sort', sort);
    api(`/products?${params}`)
      .then(({ products: found }) => { setProducts(found); setError(''); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || !value || value === 'featured') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="catalog-page page-shell">
      <div className="catalog-intro"><div><span className="eyebrow">THE NORTHSTAR COLLECTION</span><h1>Good things,<br /><em>right this way.</em></h1></div><p>A carefully collected little world of useful, beautiful things. Find the ones that feel like you.</p></div>
      <div className="catalog-tools"><div className="category-filters"><SlidersHorizontal size={15} /><span>Explore:</span>{categoryList.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => update('category', item)}>{item}</button>)}</div><label className="sort-control">Sort by <select value={sort} onChange={(event) => update('sort', event.target.value)}><option value="featured">Our favorites</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>
      {search && <div className="search-result-label">Showing results for <strong>“{search}”</strong> <button onClick={() => update('search', '')}>Clear <ArrowUpRight size={13} /></button></div>}
      {error ? <div className="empty-state"><h2>We couldn’t load the collection.</h2><p>{error}</p></div> : loading ? <div className="loading-state">Gathering the good things…</div> : products.length ? <div className="product-grid catalog-grid">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div> : <div className="empty-state"><span className="eyebrow">NOTHING JUST YET</span><h2>No matches this time.</h2><p>Try a different search or explore the whole collection.</p><button className="button button-dark" onClick={() => setSearchParams({})}>See all good things <ArrowUpRight size={15} /></button></div>}
    </div>
  );
}

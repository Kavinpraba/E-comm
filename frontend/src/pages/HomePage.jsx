import { ArrowDownRight, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import './HomePage.css';

const categories = [
  { name: 'Home', title: 'Make room for calm', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85', note: 'Objects with a softer side' },
  { name: 'Accessories', title: 'The finishing touch', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85', note: 'Little details, big feeling' },
  { name: 'Wellness', title: 'A slower kind of ritual', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85', note: 'Make time for you' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/products?featured=true')
      .then(({ products: found }) => setProducts(found.slice(0, 4)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> A LITTLE MORE INTENTIONAL</span>
          <h1>Find your<br />everyday <em>favorite.</em></h1>
          <p>Good things for the spaces you make, the rituals you keep, and all the in-between.</p>
          <div className="hero-actions"><Link className="button button-dark" to="/shop">Shop the collection <ArrowRight size={16} /></Link><span>Thoughtfully found, just for you.</span></div>
          <div className="hero-index"><span>01</span><span className="hero-index-line" /><span>Curated for the everyday</span></div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1500&q=90" alt="Warm, thoughtfully styled living room" />
          <div className="hero-photo-caption"><span>THE SLOW LIVING EDIT</span><ArrowUpRight size={16} /></div>
          <div className="hero-sticker"><span>Made for</span><strong>every<br />day</strong><ArrowDownRight size={16} /></div>
        </div>
        <div className="hero-bottom-note">Considered things, collected with care <span>✳</span></div>
      </section>

      <section className="promise-strip"><div className="page-shell promise-inner"><span>✳&nbsp; A little more considered</span><span>✳&nbsp; Good things that last</span><span>✳&nbsp; Made for everyday life</span><span>✳&nbsp; A little more considered</span></div></section>

      <section className="section-block page-shell featured-section">
        <div className="section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Some things we <em>love.</em></h2></div><Link className="text-link" to="/shop">Explore everything <ArrowUpRight size={16} /></Link></div>
        {error ? <div className="inline-notice">{error}</div> : products.length > 0 ? <div className="product-grid">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div> : <div className="loading-state">Finding a few favorites for you…</div>}
      </section>

      <section className="category-section">
        <div className="page-shell"><div className="section-heading"><div><span className="eyebrow">A PLACE FOR EVERYTHING</span><h2>Find your <em>kind</em> of thing.</h2></div><span className="section-aside">Little moments, made a bit<br />more lovely.</span></div>
          <div className="category-grid">{categories.map((category, index) => (
            <Link className={`category-card category-card-${index + 1}`} to={`/shop?category=${category.name}`} key={category.name}>
              <img src={category.image} alt="" loading="lazy" /><span className="category-number">0{index + 1}</span><span className="category-arrow"><ArrowUpRight size={18} /></span>
              <div className="category-copy"><span>{category.note}</span><h3>{category.title}</h3><span className="category-shop">Shop {category.name.toLowerCase()} <ArrowRight size={14} /></span></div>
            </Link>
          ))}</div>
        </div>
      </section>

      <section className="editorial page-shell"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=85" alt="Soft sunlight across a calm home interior" loading="lazy" /><span className="editorial-image-label">A HOME, A FEELING</span></div><div className="editorial-copy"><span className="eyebrow">OUR LITTLE PHILOSOPHY</span><h2>Less, but<br />a little <em>lovelier.</em></h2><p>We think the everyday deserves a little extra thought. So we look for useful, beautiful, well-made things that feel just right — and bring them together in one happy place.</p><Link className="button button-outline" to="/shop">Get to know the collection <ArrowRight size={16} /></Link><span className="editorial-mark">n<span>✳</span></span></div></section>

      <section className="quote-band"><div className="page-shell quote-content"><span className="eyebrow">A SMALL REMINDER</span><p>“A life well lived is made up of the little things.”</p><span>THE NORTHSTAR NOTE&nbsp; ✳</span></div></section>
    </>
  );
}

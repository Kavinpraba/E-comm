import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function search(event) {
    event.preventDefault();
    navigate(`/shop${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`);
    setMenuOpen(false);
  }

  function signOut() {
    logout();
    navigate('/');
  }

  return (
    <>
      <div className="announcement">A little something for your everyday <span>— free shipping over $75</span></div>
      <header className="site-header">
        <div className="header-main page-shell">
          <button className="icon-button mobile-menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link className="brand" to="/" aria-label="Northstar Market home">
            <span className="brand-mark">n<span>✳</span></span>
            <span className="brand-name">northstar<span>market</span></span>
          </Link>
          <form className="header-search" onSubmit={search}>
            <Search size={17} />
            <input aria-label="Search products" placeholder="Search for something lovely…" value={query} onChange={(event) => setQuery(event.target.value)} />
            <button type="submit" aria-label="Submit search"><ArrowRight size={17} /></button>
          </form>
          <div className="header-actions">
            {user ? (
              <>
                {user.role === 'admin' && <Link className="account-link admin-link" to="/admin">Studio</Link>}
                <span className="hello-user">Hi, {user.name.split(' ')[0]}</span>
                <button className="account-link signout-link" onClick={signOut}>Sign out</button>
              </>
            ) : <Link className="account-link" to="/login">Sign in</Link>}
            <Link to="/cart" className="cart-link" aria-label={`Shopping bag, ${count} items`}>
              <ShoppingBag size={21} /><span>Bag</span><b>{count}</b>
            </Link>
          </div>
        </div>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <div className="page-shell nav-inner">
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop all</NavLink>
            <NavLink to="/shop?category=Home" onClick={() => setMenuOpen(false)}>Home & living</NavLink>
            <NavLink to="/shop?category=Accessories" onClick={() => setMenuOpen(false)}>Accessories</NavLink>
            <NavLink to="/shop?category=Wellness" onClick={() => setMenuOpen(false)}>Wellness</NavLink>
            <NavLink to="/shop?category=Stationery" onClick={() => setMenuOpen(false)}>Stationery</NavLink>
            <span className="nav-note">Good things, thoughtfully found.</span>
          </div>
        </nav>
      </header>
    </>
  );
}

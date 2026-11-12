import { ArrowUpRight, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="brand footer-logo" to="/">
              <span className="brand-mark">n<span>✳</span></span>
              <span className="brand-name">northstar<span>market</span></span>
            </Link>
            <p>Find your everyday favorite.<br />A considered collection for the life you love.</p>
            <a className="social-link" href="https://instagram.com" aria-label="Visit Instagram"><Instagram size={17} /> Follow along <ArrowUpRight size={14} /></a>
          </div>
          <div className="footer-column"><strong>Explore</strong><Link to="/shop">Shop all</Link><Link to="/shop?category=Home">Home & living</Link><Link to="/shop?category=Wellness">Wellness</Link></div>
          <div className="footer-column"><strong>Here to help</strong><a href="mailto:hello@northstarmarket.example">Contact us</a><a href="mailto:hello@northstarmarket.example">Shipping & returns</a><Link to="/login">Your account</Link></div>
          <div className="newsletter">
            <span className="eyebrow">A good thing in your inbox</span>
            <h3>A little note from us,<br />now and then.</h3>
            <form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Your email address" /><button aria-label="Join newsletter"><ArrowUpRight size={18} /></button></form>
            <small>By subscribing, you agree to our very reasonable privacy policy.</small>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2025 Northstar Market. Made for everyday living.</span><span>Thoughtful finds. A little less ordinary.</span></div>
      </div>
    </footer>
  );
}

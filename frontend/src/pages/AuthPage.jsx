import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPage.css';

export default function AuthPage({ register = false }) {
  const { login, register: createAccount } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await (register ? createAccount(form) : login({ email: form.email, password: form.password }));
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return <div className="auth-page page-shell"><div className="auth-visual"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="A sunny, thoughtful home interior" /><span className="auth-photo-note">THE NORTHSTAR WAY&nbsp; ✳</span><p>Good things feel even better<br />when they feel like yours.</p></div><div className="auth-panel"><Link to="/" className="auth-back"><ArrowLeft size={14} /> Back to the good things</Link><span className="eyebrow">{register ? 'A GOOD PLACE TO BEGIN' : 'GOOD TO HAVE YOU BACK'}</span><h1>{register ? <>Let’s make it<br /><em>your place.</em></> : <>Come on<br /><em>back in.</em></>}</h1><p>{register ? 'Create an account to keep your favorites close and checkout a little quicker.' : 'Your favorites, your orders, and all the good things — right where you left them.'}</p>
    <form className="auth-form" onSubmit={submit}>{register && <label>Your name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="What should we call you?" /></label>}<label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>Password<input required type="password" minLength="8" autoComplete={register ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={register ? 'At least 8 characters' : 'Your password'} /></label>{error && <div className="form-error">{error}</div>}<button className="button button-dark auth-submit" disabled={busy}>{busy ? 'One moment…' : register ? 'Create your account' : 'Sign in'} <ArrowRight size={16} /></button></form>
    <div className="auth-switch"><span>{register ? 'Already have a little place here?' : 'New around here?'}</span><Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'} <ArrowRight size={13} /></Link></div>
    <div className="auth-reassurance"><Check size={14} /> Your details stay safe, always.</div></div></div>;
}

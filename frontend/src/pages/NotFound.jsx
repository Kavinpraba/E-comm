import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return <div className="empty-state"><span className="eyebrow">A LITTLE DETOUR</span><h1>This page wandered off.</h1><Link to="/" className="button button-dark">Back to the good things <ArrowUpRight size={15} /></Link></div>;
}

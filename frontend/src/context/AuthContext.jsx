import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('northstar-token')) {
      setReady(true);
      return;
    }
    api('/auth/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem('northstar-token'))
      .finally(() => setReady(true));
  }, []);

  async function signIn(path, details) {
    const result = await api(path, { method: 'POST', body: JSON.stringify(details) });
    localStorage.setItem('northstar-token', result.token);
    setUser(result.user);
    return result.user;
  }

  function signOut() {
    localStorage.removeItem('northstar-token');
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    ready,
    login: (details) => signIn('/auth/login', details),
    register: (details) => signIn('/auth/register', details),
    logout: signOut,
  }), [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}

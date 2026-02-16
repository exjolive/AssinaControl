
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Trash2,
  Edit2,
  ArrowRight,
  ChevronRight,
  Settings,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { User, Subscription, AppState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';
import Reports from './components/Reports';
import { FREE_LIMIT } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    subscriptions: [],
    loading: true
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('assina_user');
    const storedSubs = localStorage.getItem('assina_subs');
    
    if (storedUser) {
      setState(prev => ({
        ...prev,
        user: JSON.parse(storedUser),
        subscriptions: storedSubs ? JSON.parse(storedSubs) : [],
        loading: false
      }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('assina_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => {
    localStorage.removeItem('assina_user');
    setState(prev => ({ ...prev, user: null }));
  };

  const addSubscription = (sub: Omit<Subscription, 'id' | 'user_id' | 'created_at'>) => {
    if (!state.user) return;
    
    if (state.user.plano === 'free' && state.subscriptions.length >= FREE_LIMIT) {
      alert(`O plano Gratuito permite apenas ${FREE_LIMIT} assinaturas. Considere o Plano Premium!`);
      return;
    }

    const newSub: Subscription = {
      ...sub,
      id: Math.random().toString(36).substr(2, 9),
      user_id: state.user.id,
      created_at: new Date().toISOString()
    };

    const updated = [...state.subscriptions, newSub];
    localStorage.setItem('assina_subs', JSON.stringify(updated));
    setState(prev => ({ ...prev, subscriptions: updated }));
  };

  const deleteSubscription = (id: string) => {
    const updated = state.subscriptions.filter(s => s.id !== id);
    localStorage.setItem('assina_subs', JSON.stringify(updated));
    setState(prev => ({ ...prev, subscriptions: updated }));
  };

  const updateSubscription = (id: string, updatedData: Partial<Subscription>) => {
    const updated = state.subscriptions.map(s => s.id === id ? { ...s, ...updatedData } : s);
    localStorage.setItem('assina_subs', JSON.stringify(updated));
    setState(prev => ({ ...prev, subscriptions: updated }));
  };

  const upgradePlan = () => {
    if (!state.user) return;
    const upgradedUser: User = { ...state.user, plano: 'premium' };
    localStorage.setItem('assina_user', JSON.stringify(upgradedUser));
    setState(prev => ({ ...prev, user: upgradedUser }));
  };

  if (state.loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-financial-dark text-emerald-400">Carregando...</div>;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-financial-dark flex">
        {state.user ? (
          <>
            <Sidebar handleLogout={handleLogout} plan={state.user.plano} />
            <main className="flex-1 flex flex-col md:pl-64 overflow-x-hidden">
              <Header user={state.user} />
              <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<Dashboard subscriptions={state.subscriptions} user={state.user} />} />
                  <Route path="/assinaturas" element={<SubscriptionList subscriptions={state.subscriptions} onDelete={deleteSubscription} />} />
                  <Route path="/adicionar" element={<SubscriptionForm onSave={addSubscription} currentCount={state.subscriptions.length} plan={state.user.plano} />} />
                  <Route path="/relatorios" element={<Reports subscriptions={state.subscriptions} onUpgrade={upgradePlan} plan={state.user.plano} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

const Sidebar: React.FC<{ handleLogout: () => void, plan: string }> = ({ handleLogout, plan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Assinaturas', path: '/assinaturas', icon: CreditCard },
    { name: 'Relatórios', path: '/relatorios', icon: PieChart },
    { name: 'Nova Assinatura', path: '/adicionar', icon: PlusCircle },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-financial-card rounded-lg border border-slate-700 shadow-xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-financial-card border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="bg-financial-green p-2 rounded-xl">
              <CreditCard className="text-financial-dark" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AssinaControl</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${location.pathname === link.path 
                    ? 'bg-financial-green/10 text-financial-green font-medium' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            {plan === 'free' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-xs text-emerald-400 font-semibold mb-2 uppercase tracking-wider">Assine Premium</p>
                <p className="text-sm text-slate-300 mb-3">Relatórios completos e limite ilimitado.</p>
                <Link to="/relatorios" className="block text-center text-xs font-bold py-2 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400 transition-colors">
                  CONHECER PLANOS
                </Link>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={20} />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-8 md:py-6 bg-financial-dark/80 backdrop-blur-md">
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold">Olá, {user.nome} 👋</h2>
        <p className="text-sm text-slate-400">Aqui está seu resumo financeiro.</p>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-financial-dark"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium leading-none mb-1">{user.nome}</p>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${user.plano === 'premium' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'}`}>
              {user.plano}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
            {user.nome.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default App;

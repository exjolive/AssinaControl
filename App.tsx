
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell
} from 'lucide-react';
import { User, Subscription, AppState } from './types.ts';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import SubscriptionForm from './components/SubscriptionForm.tsx';
import SubscriptionList from './components/SubscriptionList.tsx';
import Reports from './components/Reports.tsx';
import { FREE_LIMIT } from './constants.ts';
import { authService } from './services/authService.ts';
import { subscriptionService } from './services/subscriptionService.ts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    subscriptions: [],
    loading: true
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const subscriptions = await subscriptionService.getAll(user.id);
          setState({ user, subscriptions, loading: false });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Erro ao inicializar app:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    initApp();
  }, []);

  const handleLogin = async (user: User) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const subscriptions = await subscriptionService.getAll(user.id);
      setState({ user, subscriptions, loading: false });
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error);
      setState({ user, subscriptions: [], loading: false });
    }
  };

  const handleLogout = () => {
    authService.logout();
    setState({ user: null, subscriptions: [], loading: false });
  };

  const addSubscription = async (subData: Omit<Subscription, 'id' | 'user_id' | 'created_at'>) => {
    if (!state.user) return;
    
    if (state.user.plano === 'free' && state.subscriptions.length >= FREE_LIMIT) {
      alert(`O plano Gratuito permite apenas ${FREE_LIMIT} assinaturas.`);
      return;
    }

    try {
      const newSub = await subscriptionService.save(state.user.id, subData);
      setState(prev => ({ ...prev, subscriptions: [...prev.subscriptions, newSub] }));
    } catch (error) {
      alert('Erro ao salvar assinatura.');
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      await subscriptionService.delete(id);
      setState(prev => ({ ...prev, subscriptions: prev.subscriptions.filter(s => s.id !== id) }));
    } catch (error) {
      alert('Erro ao excluir assinatura.');
    }
  };

  const upgradePlan = () => {
    if (!state.user) return;
    const upgradedUser: User = { ...state.user, plano: 'premium' };
    const users = authService.getUsers();
    const updatedUsers = users.map(u => u.id === state.user?.id ? upgradedUser : u);
    localStorage.setItem('assinacontrol_users_db', JSON.stringify(updatedUsers));
    localStorage.setItem('assinacontrol_session', JSON.stringify(upgradedUser));
    setState(prev => ({ ...prev, user: upgradedUser }));
  };

  if (state.loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-financial-dark">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-400 font-medium">Sincronizando dados...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-financial-dark flex text-slate-100">
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
          <div className="w-full">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
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
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg border border-slate-700">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="bg-emerald-500 p-2 rounded-xl"><CreditCard className="text-slate-900" size={24} /></div>
            <h1 className="text-xl font-bold">AssinaControl</h1>
          </div>
          <nav className="flex-1 space-y-2">
            {links.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === link.path ? 'bg-emerald-500/10 text-emerald-500 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <link.icon size={20} />{link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <LogOut size={20} />Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header: React.FC<{ user: User }> = ({ user }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-8 md:py-6 bg-slate-950/50 backdrop-blur-md">
    <div className="hidden md:block">
      <h2 className="text-lg font-semibold text-slate-200">Olá, {user.nome} 👋</h2>
    </div>
    <div className="flex items-center gap-4 ml-auto">
      <div className="text-right">
        <p className="text-sm font-medium leading-none mb-1">{user.nome}</p>
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${user.plano === 'premium' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'}`}>{user.plano}</span>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700">{user.nome.charAt(0)}</div>
    </div>
  </header>
);

export default App;

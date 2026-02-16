
import React, { useState } from 'react';
import { CreditCard, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user: User;
      if (isRegister) {
        if (!formData.name) throw new Error('Nome é obrigatório.');
        user = await authService.register(formData.name, formData.email, formData.password);
        // Após registrar, fazemos o login automático
        user = await authService.login(formData.email, formData.password);
      } else {
        user = await authService.login(formData.email, formData.password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 z-10 relative">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-financial-green p-3 rounded-2xl"><CreditCard className="text-financial-dark" size={32} /></div>
          <h1 className="text-3xl font-black tracking-tight">AssinaControl</h1>
        </div>
        <h2 className="text-6xl font-black leading-tight mb-8">Organize suas <br /><span className="text-financial-green">assinaturas</span>.</h2>
        <p className="text-slate-400 text-xl max-w-lg mb-12">Backend simulado com persistência local e validação de credenciais segura.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md space-y-8 bg-financial-card/50 p-10 rounded-[40px] border border-slate-800 backdrop-blur-xl shadow-2xl animate-in fade-in duration-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{isRegister ? 'Crie sua conta' : 'Entrar na Plataforma'}</h3>
            <p className="text-slate-400">Dados salvos de forma privada no seu navegador.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" required placeholder="Seu nome"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" required placeholder="exemplo@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-financial-green text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegister ? 'Cadastrar Agora' : 'Acessar Conta'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? 'Já possui uma conta?' : 'Ainda não tem conta?'}
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="ml-2 text-emerald-500 font-bold hover:underline"
            >
              {isRegister ? 'Fazer Login' : 'Cadastre-se grátis'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

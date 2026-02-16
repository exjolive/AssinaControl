
import React, { useState } from 'react';
import { CreditCard, Mail, Lock, User, Github, ArrowRight, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      nome: name || email.split('@')[0],
      email: email,
      plano: 'free',
      limite_mensal: 500,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>

      {/* Hero Section (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 z-10 relative">
        <div className="flex items-center gap-2 mb-12">
          <div className="bg-financial-green p-3 rounded-2xl">
            <CreditCard className="text-financial-dark" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">AssinaControl</h1>
        </div>
        
        <h2 className="text-6xl font-black leading-tight mb-8">
          Domine seus <br />
          <span className="text-financial-green">gastos digitais</span> de vez.
        </h2>
        
        <p className="text-slate-400 text-xl max-w-lg leading-relaxed mb-12">
          A forma mais simples e visual de gerenciar Netflix, Spotify, Software e muito mais. Nunca mais seja pego de surpresa por cobranças automáticas.
        </p>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <p className="text-3xl font-bold mb-1">100%</p>
            <p className="text-slate-500 font-medium">Controle Visual</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <p className="text-3xl font-bold mb-1">Seguro</p>
            <p className="text-slate-500 font-medium">Privacidade Total</p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md space-y-8 bg-financial-card/50 p-10 rounded-[40px] border border-slate-800 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="bg-financial-green p-2 rounded-xl">
              <CreditCard className="text-financial-dark" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">AssinaControl</h1>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}</h3>
            <p className="text-slate-400">Entre com seus dados para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Seu nome aqui"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@email.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-400">Senha</label>
                {!isRegister && <button type="button" className="text-xs text-emerald-500 hover:underline">Esqueceu a senha?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-financial-green text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/10"
            >
              {isRegister ? 'Criar Conta Grátis' : 'Entrar na Plataforma'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-financial-card px-2 text-slate-500 font-bold tracking-widest">OU CONTINUE COM</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
              <Github className="w-5 h-5" />
              Github
            </button>
          </div>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? 'Já possui uma conta?' : 'Ainda não tem conta?'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
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

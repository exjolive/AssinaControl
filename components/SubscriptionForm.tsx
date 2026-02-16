
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, FREQUENCIES, FREE_LIMIT } from '../constants';
import { Category, Frequency, PaymentMethod, UserPlan } from '../types';

interface SubscriptionFormProps {
  onSave: (sub: any) => void;
  currentCount: number;
  plan: UserPlan;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSave, currentCount, plan }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_servico: '',
    valor: '',
    frequencia: 'mensal' as Frequency,
    data_cobranca: '',
    categoria: 'Streaming' as Category,
    forma_pagamento: 'Cartão' as PaymentMethod,
    observacoes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_servico || !formData.valor || !formData.data_cobranca) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onSave({
      ...formData,
      valor: parseFloat(formData.valor)
    });
    navigate('/');
  };

  const isLimitReached = plan === 'free' && currentCount >= FREE_LIMIT;

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-financial-green/20 rounded-2xl text-financial-green">
          <Plus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Nova Assinatura</h2>
          <p className="text-slate-400">Registre um novo serviço para controlar.</p>
        </div>
      </div>

      {isLimitReached ? (
        <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold">Limite atingido!</h3>
          <p className="text-slate-400">
            Você atingiu o limite de {FREE_LIMIT} assinaturas do seu plano gratuito.
            Faça um upgrade para o Plano Premium para gerenciar assinaturas ilimitadas.
          </p>
          <button 
            onClick={() => navigate('/relatorios')}
            className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Ver Planos Premium
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-financial-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Nome do Serviço</label>
              <input 
                type="text" 
                placeholder="Ex: Netflix, Spotify, Academia..."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={formData.nome_servico}
                onChange={e => setFormData({...formData, nome_servico: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0,00"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={formData.valor}
                onChange={e => setFormData({...formData, valor: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Frequência</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                value={formData.frequencia}
                onChange={e => setFormData({...formData, frequencia: e.target.value as Frequency})}
              >
                {FREQUENCIES.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Data de Cobrança (Próxima)</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={formData.data_cobranca}
                onChange={e => setFormData({...formData, data_cobranca: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Categoria</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value as Category})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 px-1">Forma de Pagamento</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                value={formData.forma_pagamento}
                onChange={e => setFormData({...formData, forma_pagamento: e.target.value as PaymentMethod})}
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 px-1">Observações (Opcional)</label>
            <textarea 
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="Detalhes adicionais..."
              value={formData.observacoes}
              onChange={e => setFormData({...formData, observacoes: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 bg-financial-green text-slate-900 rounded-2xl hover:bg-emerald-400 transition-colors font-bold flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Salvar Assinatura
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubscriptionForm;

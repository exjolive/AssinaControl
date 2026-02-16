
import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit2, MoreVertical, CreditCard, ExternalLink } from 'lucide-react';
import { Subscription } from '../types';
import { CATEGORY_COLORS, CATEGORIES } from '../constants';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.nome_servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || sub.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Minhas Assinaturas</h2>
          <p className="text-slate-400">Gerencie e edite seus planos ativos.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar serviço..."
              className="pl-10 pr-4 py-2 bg-financial-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select 
              className="pl-10 pr-8 py-2 bg-financial-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none w-full"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-financial-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Serviço</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Próxima Cobrança</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Forma</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSubs.length > 0 ? filteredSubs.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                        {sub.nome_servico.charAt(0)}
                      </div>
                      <span className="font-semibold">{sub.nome_servico}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border"
                      style={{ 
                        color: CATEGORY_COLORS[sub.categoria], 
                        borderColor: CATEGORY_COLORS[sub.categoria] + '40',
                        backgroundColor: CATEGORY_COLORS[sub.categoria] + '10' 
                      }}
                    >
                      {sub.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold">R$ {sub.valor.toFixed(2)}</span>
                    <span className="block text-[10px] text-slate-500 uppercase">{sub.frequencia}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{formatDate(sub.data_cobranca)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <CreditCard size={14} />
                      <span className="text-xs">{sub.forma_pagamento}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(sub.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma assinatura encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionList;

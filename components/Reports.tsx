
import React, { useState } from 'react';
import { 
  TrendingDown, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Subscription, UserPlan } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ReportsProps {
  subscriptions: Subscription[];
  plan: UserPlan;
  onUpgrade: () => void;
}

const Reports: React.FC<ReportsProps> = ({ subscriptions, plan, onUpgrade }) => {
  const [simulatedCancel, setSimulatedCancel] = useState<string[]>([]);

  const monthlyTotal = subscriptions.reduce((acc, s) => acc + (s.frequencia === 'mensal' ? s.valor : s.valor / 12), 0);
  const annualTotal = monthlyTotal * 12;

  const dataByCategory = Object.entries(
    subscriptions.reduce((acc, sub) => {
      const val = sub.frequencia === 'mensal' ? sub.valor : sub.valor / 12;
      acc[sub.categoria] = (acc[sub.categoria] || 0) + val;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const toggleSimulate = (id: string) => {
    setSimulatedCancel(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const potentialSavings = subscriptions
    .filter(s => simulatedCancel.includes(s.id))
    .reduce((acc, s) => acc + (s.frequencia === 'mensal' ? s.valor : s.valor / 12), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Insights</h2>
          <p className="text-slate-400">Análise profunda da sua saúde financeira digital.</p>
        </div>
        {plan === 'free' && (
          <button 
            onClick={onUpgrade}
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition-all transform hover:scale-105"
          >
            <ShieldCheck size={18} />
            Upgrade Premium
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-financial-card p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingDown className="text-emerald-400" size={20} />
              Gastos por Categoria
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                  <RechartsTooltip 
                    cursor={{ fill: '#ffffff10' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {dataByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-financial-card p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="text-indigo-400" size={20} />
              Simulador de Economia
            </h3>
            <p className="text-sm text-slate-400 mb-6">Selecione assinaturas que você pretende cancelar para ver o impacto no seu orçamento.</p>
            
            <div className="space-y-3 mb-8">
              {subscriptions.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => toggleSimulate(sub.id)}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between
                    ${simulatedCancel.includes(sub.id) 
                      ? 'bg-red-500/10 border-red-500/50' 
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {simulatedCancel.includes(sub.id) ? (
                      <div className="text-red-500"><AlertTriangle size={20} /></div>
                    ) : (
                      <div className="text-slate-500"><CheckCircle2 size={20} /></div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{sub.nome_servico}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{sub.categoria}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${simulatedCancel.includes(sub.id) ? 'text-red-400' : 'text-slate-300'}`}>
                    - R$ {sub.valor.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-bold">Economia Potencial</p>
              <h4 className="text-3xl font-black text-emerald-400">R$ {potentialSavings.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ mês</span></h4>
              <p className="text-xs text-slate-500 mt-2">Isso representa uma economia anual de R$ {(potentialSavings * 12).toFixed(2)}!</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Plans */}
        <div className="space-y-8">
          <div className="bg-financial-card p-6 rounded-3xl border border-slate-800">
            <h3 className="text-lg font-bold mb-6">Assine o Premium</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                 {[
                   'Assinaturas Ilimitadas',
                   'Gráficos Detalhados',
                   'Simulador de Economia Avançado',
                   'Alertas de Cobrança (3 dias antes)',
                   'Suporte Prioritário'
                 ].map(item => (
                   <div key={item} className="flex items-start gap-3">
                     <CheckCircle2 size={16} className="text-financial-green mt-0.5" />
                     <span className="text-sm text-slate-300">{item}</span>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div 
                  onClick={plan === 'free' ? onUpgrade : undefined}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${plan === 'premium' ? 'border-financial-green bg-financial-green/10' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mensal</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">R$ 9,90</span>
                    <span className="text-slate-500 text-xs font-medium">/ mês</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl border-2 border-slate-800 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">MAIS VANTAJOSO</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vitalício</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">R$ 49,90</span>
                    <span className="text-slate-500 text-xs font-medium">pagamento único</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

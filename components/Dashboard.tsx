
import React, { useMemo } from 'react';
import { 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  Tag, 
  Plus,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from 'recharts';
import { Subscription, User } from '../types.ts';
import { CATEGORY_COLORS } from '../constants.ts';
import { Link } from 'react-router-dom';

interface DashboardProps {
  subscriptions: Subscription[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ subscriptions, user }) => {
  const stats = useMemo(() => {
    const monthly = subscriptions.reduce((acc, sub) => {
      if (sub.frequencia === 'mensal') return acc + sub.valor;
      return acc + (sub.valor / 12);
    }, 0);

    const annual = monthly * 12;

    const byCategory = subscriptions.reduce((acc, sub) => {
      const category = sub.categoria;
      const value = sub.frequencia === 'mensal' ? sub.valor : sub.valor / 12;
      acc[category] = (acc[category] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(byCategory).map(([name, value]) => ({
      name,
      value: Number((value as number).toFixed(2))
    }));

    const nextBills = [...subscriptions]
      .sort((a, b) => new Date(a.data_cobranca).getDate() - new Date(b.data_cobranca).getDate())
      .slice(0, 3);

    return { monthly, annual, chartData, nextBills };
  }, [subscriptions]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-sm relative overflow-hidden">
          <p className="text-sm font-medium text-slate-400 mb-1">Total Mensal</p>
          <h3 className="text-3xl font-bold mb-2 text-white">R$ {stats.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight size={14} />
            <span>Baseado no plano atual</span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
          <p className="text-sm font-medium text-slate-400 mb-1">Total Anual</p>
          <h3 className="text-3xl font-bold mb-2 text-white">R$ {stats.annual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-500 font-medium">Projeção para os próximos 12 meses</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
               <Zap size={20} />
             </div>
             <Link to="/adicionar" className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
               Novo <Plus size={14} />
             </Link>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Assinaturas Ativas</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{subscriptions.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <h4 className="text-lg font-bold mb-6 text-slate-200">Gastos por Categoria</h4>
          <div className="h-[250px] w-full">
            {subscriptions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
             {stats.chartData.map((data) => (
               <div key={data.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[data.name as keyof typeof CATEGORY_COLORS] }}></div>
                 <span className="text-xs text-slate-400">{data.name}</span>
                 <span className="text-xs font-bold ml-auto text-slate-300">R$ {data.value}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-200">Próximas Cobranças</h4>
            <Link to="/assinaturas" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.nextBills.length > 0 ? stats.nextBills.map(sub => (
              <div key={sub.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-500 border border-slate-700">
                  {sub.nome_servico.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-200">{sub.nome_servico}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{sub.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-white">R$ {sub.valor.toFixed(2)}</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">Dia {new Date(sub.data_cobranca).getDate()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">Nenhuma cobrança agendada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

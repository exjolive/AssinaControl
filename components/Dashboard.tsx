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
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Subscription, User } from '../types';
import { CATEGORY_COLORS } from '../constants';
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
      // Fix: Cast value to number as Object.entries might be inferred as [string, unknown][] in some TS environments
      value: Number((value as number).toFixed(2))
    }));

    // Next bills
    const nextBills = [...subscriptions]
      .sort((a, b) => new Date(a.data_cobranca).getDate() - new Date(b.data_cobranca).getDate())
      .slice(0, 3);

    return { monthly, annual, chartData, nextBills };
  }, [subscriptions]);

  const barChartData = [
    { name: 'Jan', total: stats.monthly * 0.9 },
    { name: 'Fev', total: stats.monthly * 0.95 },
    { name: 'Mar', total: stats.monthly },
    { name: 'Abr', total: stats.monthly * 1.05 },
    { name: 'Mai', total: stats.monthly },
    { name: 'Jun', total: stats.monthly },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-financial-card p-6 rounded-3xl border border-slate-800 shadow-sm overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 bg-emerald-500/10 p-8 rounded-full transform group-hover:scale-110 transition-transform">
            <DollarSign className="text-emerald-500" size={32} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Mensal</p>
          <h3 className="text-3xl font-bold mb-2">R$ {stats.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            <span>Média baseada no último mês</span>
          </div>
        </div>

        <div className="bg-financial-card p-6 rounded-3xl border border-slate-800 shadow-sm overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 bg-blue-500/10 p-8 rounded-full transform group-hover:scale-110 transition-transform">
            <Calendar className="text-blue-500" size={32} />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Total Anual Estimado</p>
          <h3 className="text-3xl font-bold mb-2">R$ {stats.annual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-500 font-medium">Projeção para os próximos 12 meses</p>
        </div>

        <div className="bg-financial-card p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-indigo-500/10 rounded-2xl">
               <Zap className="text-indigo-400" size={20} />
             </div>
             <Link to="/adicionar" className="text-xs font-bold text-financial-green hover:underline flex items-center gap-1">
               Adicionar <Plus size={14} />
             </Link>
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Assinaturas Ativas</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{subscriptions.length}</h3>
            {user.plano === 'free' && (
              <span className="text-xs text-slate-500">/ 5 do plano free</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Chart */}
        <div className="bg-financial-card p-6 rounded-3xl border border-slate-800">
          <h4 className="text-lg font-bold mb-6">Gastos por Categoria</h4>
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
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <PieChart size={48} className="mb-2 opacity-20" />
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
             {stats.chartData.map((data) => (
               <div key={data.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[data.name as keyof typeof CATEGORY_COLORS] }}></div>
                 <span className="text-xs text-slate-400">{data.name}</span>
                 <span className="text-xs font-bold ml-auto">R$ {data.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Next Bills */}
        <div className="bg-financial-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">Próximas Cobranças</h4>
            <Link to="/assinaturas" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.nextBills.length > 0 ? stats.nextBills.map(sub => (
              <div key={sub.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                  <Clock className="text-slate-400" size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{sub.nome_servico}</p>
                  <p className="text-xs text-slate-400">{sub.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">R$ {sub.valor.toFixed(2)}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Dia {new Date(sub.data_cobranca).getDate()}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">Você não possui cobranças agendadas.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-financial-green/10 border border-financial-green/20 rounded-2xl flex items-center gap-4">
             <div className="p-2 bg-financial-green rounded-lg text-slate-900">
               <Tag size={18} />
             </div>
             <div>
               <p className="text-sm font-bold text-financial-green leading-tight">Dica de hoje</p>
               <p className="text-xs text-slate-400">Pague assinaturas anuais para economizar até 20% no total.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
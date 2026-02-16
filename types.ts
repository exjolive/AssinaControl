
export type Category = 'Streaming' | 'Software' | 'Academia' | 'Educação' | 'Outros';
export type Frequency = 'mensal' | 'anual';
export type PaymentMethod = 'Cartão' | 'Pix' | 'Débito' | 'Outro';
export type UserPlan = 'free' | 'premium';

export interface Subscription {
  id: string;
  user_id: string;
  nome_servico: string;
  valor: number;
  frequencia: Frequency;
  data_cobranca: string;
  categoria: Category;
  forma_pagamento: PaymentMethod;
  observacoes?: string;
  created_at: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  plano: UserPlan;
  limite_mensal: number;
  created_at: string;
}

export interface AppState {
  user: User | null;
  subscriptions: Subscription[];
  loading: boolean;
}

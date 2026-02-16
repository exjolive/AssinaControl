
import { Category, PaymentMethod, Frequency } from './types';

export const CATEGORIES: Category[] = ['Streaming', 'Software', 'Academia', 'Educação', 'Outros'];
export const PAYMENT_METHODS: PaymentMethod[] = ['Cartão', 'Pix', 'Débito', 'Outro'];
export const FREQUENCIES: Frequency[] = ['mensal', 'anual'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Streaming: '#10b981', // green
  Software: '#3b82f6',  // blue
  Academia: '#f59e0b',  // amber
  Educação: '#8b5cf6', // violet
  Outros: '#94a3b8',    // slate
};

export const FREE_LIMIT = 5;

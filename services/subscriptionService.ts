
import { Subscription } from '../types.ts';

const SUBS_KEY = 'assinacontrol_subs_db';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const subscriptionService = {
  getAll: async (userId: string): Promise<Subscription[]> => {
    await delay(400);
    const allSubs = localStorage.getItem(SUBS_KEY);
    const subs: Subscription[] = allSubs ? JSON.parse(allSubs) : [];
    return subs.filter(s => s.user_id === userId);
  },

  save: async (userId: string, sub: Omit<Subscription, 'id' | 'user_id' | 'created_at'>): Promise<Subscription> => {
    await delay(600);
    const allSubsData = localStorage.getItem(SUBS_KEY);
    const allSubs: Subscription[] = allSubsData ? JSON.parse(allSubsData) : [];

    const newSub: Subscription = {
      ...sub,
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      created_at: new Date().toISOString()
    };

    localStorage.setItem(SUBS_KEY, JSON.stringify([...allSubs, newSub]));
    return newSub;
  },

  delete: async (subId: string): Promise<void> => {
    await delay(300);
    const allSubsData = localStorage.getItem(SUBS_KEY);
    if (!allSubsData) return;
    
    const allSubs: Subscription[] = JSON.parse(allSubsData);
    const filtered = allSubs.filter(s => s.id !== subId);
    localStorage.setItem(SUBS_KEY, JSON.stringify(filtered));
  }
};

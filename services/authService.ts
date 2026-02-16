
import { User } from '../types.ts';

const USERS_KEY = 'assinacontrol_users_db';
const CURRENT_USER_KEY = 'assinacontrol_session';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  register: async (nome: string, email: string, password: string): Promise<User> => {
    await delay(800);
    const users = authService.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newUser: User & { password?: string } = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      email,
      password,
      plano: 'free',
      limite_mensal: 500,
      created_at: new Date().toISOString()
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const users = authService.getUsers();
    const user = users.find(u => (u as any).email === email) as any;

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.password !== password) {
      throw new Error('Senha incorreta.');
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    return session ? JSON.parse(session) : null;
  }
};

// Mock Auth Service supporting localStorage and demo credentials

const STORAGE_KEY_USER = 'nexusflow_user';
const STORAGE_KEY_TOKEN = 'nexusflow_token';

const DEMO_USER = {
  id: 'usr_admin_01',
  name: 'Alex Rivera',
  email: 'admin@nexusflow.com',
  company: 'NexusFlow Automation Ltd.',
  role: 'System Administrator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const authService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 600));

    if (email === 'admin@nexusflow.com' && password === 'admin123') {
      const user = { ...DEMO_USER };
      const token = 'mock-jwt-token-nexusflow-admin-12345';
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      return { success: true, user, token };
    }

    // Allow generic login for testing custom email/pass if user registered
    const storedUsers = JSON.parse(localStorage.getItem('nexusflow_registered_users') || '[]');
    const matched = storedUsers.find(u => u.email === email && u.password === password);
    if (matched) {
      const user = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        company: matched.company,
        role: 'Operator',
        avatar: ''
      };
      const token = `mock-jwt-token-${matched.id}`;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
      return { success: true, user, token };
    }

    throw new Error('Invalid email or password. Try demo: admin@nexusflow.com / admin123');
  },

  register: async ({ name, email, password, company }) => {
    await new Promise(res => setTimeout(res, 600));

    const storedUsers = JSON.parse(localStorage.getItem('nexusflow_registered_users') || '[]');
    if (storedUsers.some(u => u.email === email) || email === 'admin@nexusflow.com') {
      throw new Error('User with this email already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      company
    };

    storedUsers.push(newUser);
    localStorage.setItem('nexusflow_registered_users', JSON.stringify(storedUsers));

    return { success: true, user: newUser };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    return { success: true };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  updateUserProfile: (updates) => {
    const current = authService.getCurrentUser() || DEMO_USER;
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  }
};

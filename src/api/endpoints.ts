import { api } from './client';
import type { User, LeaderboardResponse, SystemInfo } from '@/types';

export const authApi = {
  register: async (idToken: string, username: string) => {
    const response = await api.post('/user/register', { username }, {
      headers: { Authorization: idToken }
    });
    return { user: response.data, token: idToken };
  },

  login: async (idToken: string) => {
    const response = await api.post('/user/login', {}, {
      headers: { Authorization: idToken }
    });
    return { user: response.data, token: idToken };
  },

  getMe: async () => {
    const response = await api.get('/user/me');
    return response.data as User;
  },

  deleteAccount: async () => {
    const response = await api.delete('/user/delete');
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.get(`/user/availability/${username}`);
    return response.data as { available: boolean };
  },
};

export const leaderboardApi = {
  getLeaderboard: async (page = 1, limit = 20) => {
    const response = await api.get('/user/leaderboard', { params: { page, limit } });
    return response.data as LeaderboardResponse;
  },
};

export const systemApi = {
  getInfo: async () => {
    const response = await api.get('/system/info');
    return response.data as SystemInfo;
  },
  disconnectEveryone: async () => {
    const response = await api.post('/system/disconnect_everyone');
    return response.data;
  },
};

export const reportApi = {
  getReports: async (page = 1, status?: string) => {
    const banned = status === 'banned' ? 'true' : status === 'active' ? 'false' : undefined;
    const response = await api.get('/reported_entry/get_reports', { 
      params: { page, banned } 
    });
    return response.data;
  },

  banEntry: async (id: string) => {
    const response = await api.put(`/reported_entry/ban/${id}`);
    return response.data;
  },

  unbanEntry: async (id: string) => {
    const response = await api.put(`/reported_entry/unban/${id}`);
    return response.data;
  },

  dismissReport: async (id: string) => {
    const response = await api.put(`/reported_entry/dismiss/${id}`);
    return response.data;
  },
};

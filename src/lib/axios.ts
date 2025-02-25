import axios from 'axios';
import { refreshToken } from './hooks/useRefreshToken';

export const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME_URL;
export const BASE_URL_LOCAL = process.env.NEXT_PUBLIC_HOSTNAME_URL_LOCAL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    if (typeof window !== 'undefined') {
      // Lado do cliente
      token = await refreshToken(); // Chama refreshToken, que verifica e renova se necessário
    } else {
      // Lado do servidor (exemplo com App Router e NextAuth v5)
      const { auth } = await import('@/auth');
      const session = await auth();
      token = session?.user.token; // Aqui você pode adicionar lógica de refresh no servidor, se aplicável
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta (opcional) para tratar falhas de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa repetida
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca como tentativa repetida
      const newToken = await refreshToken(); // Tenta renovar o token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest); // Repete a requisição com o novo token
    }

    return Promise.reject(error);
  }
);

export default api;

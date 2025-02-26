'use client';
import axios from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRefreshToken } from './useRefreshToken';

const useAxiosAuth = (token: string): AxiosInstance => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;
          try {
            // Obtenha um novo token de acesso usando refreshToken
            const newToken = await refreshToken();
            prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(prevRequest);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refreshToken, session, token]);

  return axios;
};

export default useAxiosAuth;

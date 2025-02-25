
import { decode } from 'jsonwebtoken';
import dayjs from 'dayjs';
import { getSession } from 'next-auth/react'; // Para o cliente
import { JwtPayload } from 'jsonwebtoken'; // Tipo explícito para decode
import api from '../axios';

export const refreshToken = async () => {
  const session = await getSession();

  if (!session?.user?.token || !session?.user?.refreshToken) {
    throw new Error('No token or refresh token available');
  }

  const decoded = decode(session.user.token) as JwtPayload | string | null;
  if (!decoded || typeof decoded !== 'object' || !('exp' in decoded) || typeof decoded.exp !== 'number') {
    throw new Error('Invalid token format or missing expiration');
  }

  const isTokenExpired = dayjs().isAfter(dayjs.unix(decoded.exp));
  if (!isTokenExpired) {
    return session.user.token; // Token ainda válido, retorna o atual
  }

  // Token expirado, faz a renovação
  const response = await api.post('/refresh-token', {
    refresh_token: session.user.refreshToken.id,
  });
  const newToken = response.data;

  if (!newToken.token) {
    throw new Error('Failed to refresh token');
  }

  // Atualiza a sessão no lado do cliente
  const updatedSession = {
    ...session,
    user: {
      ...session.user,
      token: newToken.token,
      ...(newToken.newRefreshToken && {
        refreshToken: {
          id: newToken.newRefreshToken.id,
          expiresIn: newToken.newRefreshToken.expiresIn,
          userIdRefresh: newToken.newRefreshToken.userIdRefresh,
        },
      }),
    },
  };

  // Como `update` não está disponível, confiamos no backend para sincronizar a sessão
  // Alternativamente, podemos disparar um evento para recarregar a sessão manualmente
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedSession),
  });

  return newToken.token;
};

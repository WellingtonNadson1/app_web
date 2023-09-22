"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { axiosAuth } from "../axios"
import { useRefreshToken } from "./useRefreshToken"

const useAxiosAuth = () => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session?.user.token}`
      }
      return config
    },
    (error) => Promise.reject(error)
    )

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          await refreshToken()
          prevRequest.headers["Authorization"] = `Bearer ${session?.user.token}`
          return axiosAuth(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept)
      axiosAuth.interceptors.response.eject(responseIntercept)
    }
  }, [session])

  return axiosAuth
}

export default useAxiosAuth

// const hostname = 'app-ibb.onrender.com'

// // Criar uma função para obter o token de acesso salvo no localStorage
// function getAccessToken() {
//   return localStorage.getItem('accessToken');
// }

// // Criar uma função para obter o refreshToken salvo no localStorage
// function getRefreshToken() {
//   const refreshToken = localStorage.getItem('refreshToken');
//   return refreshToken ? JSON.parse(refreshToken) : null;
// }

// // Criar uma função para salvar os novos tokens no localStorage
// function setTokens(accessToken: string, refreshToken: object) {
//   localStorage.setItem('accessToken', accessToken);
//   localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
// }

// // Criar uma variável para armazenar a promessa de atualização do token
// let refreshPromise: Promise<string> | null = null;

// // Criar uma função para atualizar o token de acesso usando o refreshToken
// async function refreshAccessToken(refreshToken: object) {
//   // Se já existe uma promessa de atualização em andamento, retorná-la
//   if (refreshPromise) { return refreshPromise; }

//   // Senão, criar uma nova promessa de atualização e armazená-la na variável
//   refreshPromise = fetch(`https://${hostname}/cultosindividuais/refresh-token`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ refresh_token: JSON.stringify(refreshToken) })
//   }).then(response => response.json())
//   .then(data => {
//     // Se a resposta for bem-sucedida, salvar os novos tokens no localStorage
//     if (data.token) {
//       const newRefreshToken = data.newRefreshToken || refreshToken;
//       setTokens(data.token, newRefreshToken);
//       return data.token;
//     }
//     // Senão, lançar um erro
//     throw new Error('Failed to refresh token');
//   }).finally(() => {
//     // Limpar a variável da promessa de atualização
//     refreshPromise = null;
//   });

//   // Retornar a promessa de atualização
//   return refreshPromise;
// }

// // Criar uma função para fazer requisições com o fetch
// async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
//   // Obter o token de acesso do localStorage
//   const accessToken = getAccessToken();

//   // Se o token existir, adicioná-lo ao cabeçalho Authorization
//   if (accessToken) {
//     init = {
//       ...init,
//       headers: {
//         ...init?.headers,
//         Authorization: `Bearer ${accessToken}`
//       }
//     };
//   }

//   // Fazer a requisição com o fetch
//   const response = await fetch(input, init);

//   // Se a resposta tiver status 401, tentar atualizar o token
//   if (response.status === 401) {
//     const refreshToken = getRefreshToken();

//     if (refreshToken) {
//       const newAccessToken = await refreshAccessToken(refreshToken);

//       if (newAccessToken) {
//         init = {
//           ...init,
//           headers: {
//             ...init?.headers,
//             Authorization: `Bearer ${newAccessToken}`
//           }
//         };

//         // Repetir a requisição com o novo token
//         return fetch(input, init);
//       }
//     }
//   }

//   // Retornar a resposta original se não for um erro de autenticação ou se a atualização do token falhar
//   return response;
// }

// export default fetchWithAuth;

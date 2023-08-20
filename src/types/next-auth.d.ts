// eslint-disable-next-line no-unused-vars
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      role: string
      first_name: string
      last_name: string
      email: string
      image_url: string
      supervisao_pertence: string
      celula: string
      escolas: string
      encontros: string
      cpf: string
      sexo: string
      telefone: string
      escolaridade: string
      profissao: string
      batizado: boolean
      is_discipulado: boolean
      discipulador: string
      estado_civil: string
      nome_conjuge: string
      presencas_aulas_escolas: string
      presencas_cultos: string
      token: string
    } & DefaultSession
  }
}

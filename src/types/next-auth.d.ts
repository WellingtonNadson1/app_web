// eslint-disable-next-line no-unused-vars
import 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      role: string
      user_roles: {
        rolenew: {
          name: string
        }
      }[]
      email: string
      image_url: string
      first_name: string
      last_name: string
      cpf: string
      date_nascimento: string | Date
      sexo: string
      telefone: string
      escolaridade: string
      profissao: string
      batizado: string
      date_batizado: string | Date
      is_discipulado: string
      discipuladorId: string
      user: {
        id: string
        first_name: string
      }
      supervisao_pertence: {
        id: string
        nome: string
      }
      celulaId: string
      estado_civil: string
      nome_conjuge: string
      date_casamento: string | Date
      has_filho: string
      quantidade_de_filho: number
      date_decisao: string | Date
      situacaoNoReinoId: string
      cargoDeLiderancaId: string
      token: string
      refreshToken: {
        id: string
        expiresIn: number
        userIdRefresh: string
      }
      newRefreshToken: {
        id: string
        expiresIn: number
        userIdRefresh: string
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
import 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      role: string
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
      discipulador: string
      supervisao: string
      celula: string
      estado_civil: string
      nome_conjuge: string
      date_casamento: string | Date
      has_filho: string
      quantidade_de_filho: number
      date_decisao: string | Date
      situacao_no_reino: string
      cargo_de_lideranca: string
      token: string
    }
  }
}

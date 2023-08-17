// eslint-disable-next-line no-unused-vars
import 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      email: string
      password: string
      photoPerfil: string
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
      celula: string | undefined
      escolas: [id: string, nome: string]
      encontros: [id: string, nome: string]
      estadoCivil: string
      nome_conjuge: string
      date_casamento: string | Date
      has_filho: string
      quantida_de_filho: number
      endereco_id: string | undefined
      date_decisao: string | Date
      situacao_no_reino: string
      cargo_de_lideranca: string
      token: string
    }
  }
}

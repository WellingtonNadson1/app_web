// eslint-disable-next-line no-unused-vars
import 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string
      role: string
      email: string
      password: string
      image_url: string
      first_name: string
      last_name: string
      cpf: string
      dateNasc: string | Date
      sexo: string
      telefone: string
      escolaridade: string
      profissao: string
      batizado: string
      dateBatizado: string | Date
      isDiscipulado: string
      discipulador: string
      supervisao: string
      celula: { id: string; nome: string } | undefined
      escolas: [id: string, nome: string]
      encontros: [id: string, nome: string]
      estadoCivil: string
      nomeConjuge: string
      dateCasamento: string | Date
      hasFilho: string
      quantidadeFilho: number
      endereco_id: string | undefined
      dateDecisao: string | Date
      situacao_no_reino: string
      cargo_de_lideranca: string
      celulaId: string
      token: string
    }
  }
}

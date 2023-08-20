// eslint-disable-next-line no-unused-vars
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface User extends DefaultUser {
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
    password: string
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
    has_filho: boolean
    quantidade_de_filho: number
    date_batizado: string
    date_decisao: string
    date_nascimento: string
    date_casamento: string
    cep: string
    cidade: string
    estado: string
    bairro: string
    endereco: string
    numero_casa: string
    presencas_aulas_escolas: string
    presencas_cultos: string
  }

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
      password: string
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
      has_filho: boolean
      quantidade_de_filho: number
      date_batizado: string
      date_decisao: string
      date_nascimento: string
      date_casamento: string
      cep: string
      cidade: string
      estado: string
      bairro: string
      endereco: string
      numero_casa: string
      presencas_aulas_escolas: string
      presencas_cultos: string
      token: string
    } & DefaultSession
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT extends DefaultJWT {
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
    password: string
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
    has_filho: boolean
    quantidade_de_filho: number
    date_batizado: string
    date_decisao: string
    date_nascimento: string
    date_casamento: string
    cep: string
    cidade: string
    estado: string
    bairro: string
    endereco: string
    numero_casa: string
    presencas_aulas_escolas: string
    presencas_cultos: string
  }
}

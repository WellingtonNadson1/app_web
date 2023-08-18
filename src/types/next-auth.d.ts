// eslint-disable-next-line no-unused-vars
import { Member } from '@/app/(authenticed)/novo-membro/schema'
import 'next-auth'

interface CustomToken {
  id: string
  email: string
  first_name: string
  celula_lidera: string
  supervisao_pertence: string
}

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface User {
    id: string
    email: string
    first_name: string
    situacao_no_reino: string
    cargo_de_lideranca: string
    celula_lidera: string
    supervisao_pertence: string
  }

  // eslint-disable-next-line no-unused-vars
  interface JWT {
    user: CustomToken
  }

  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: Member
  }
}

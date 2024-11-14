import { z } from "zod"

export const schemaDataUpdateDiscipulador2 = z.object({
  id: z.string(),
  discipuladorId: z.string(),
})

export type dataUpdateDiscipulador2 = z.infer<typeof schemaDataUpdateDiscipulador2>

export type dataUpdateDiscipulador = {
  id: string
  discipuladorId: string
}

interface Membro {
  user_discipulos: {
    id: string
    first_name: string
  }
}

interface Supervisor {
  id: string
  first_name: string
  discipulos: {
    user_discipulos: {
      id: string
      first_name: string
    }
  }[]
}

export interface UpdateSupervisorProps {
  member: Membro
  supervisor: Supervisor
}

export interface UpdateSupervisorProps2 {
  member: {
    user_discipulos: {
      id: string
      first_name: string
    }
  }
  supervisor: {
    id: string
    first_name: string
    discipulos: {
      user_discipulos: {
        id: string
        first_name: string
      }
    }[]
  }
}

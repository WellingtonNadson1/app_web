import { z } from "zod"

export const schemaDataUpdateDiscipulador2 = z.object({
  id: z.string(),
  newDiscipuladorId: z.string(),
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

const CargoDeLiderancaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const UserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  cargo_de_lideranca: CargoDeLiderancaSchema
});

const DiscipuladorSchema = z.object({
  user_discipulador: UserSchema,
});

const DiscipulosSchema = z.object({
  user_discipulos: UserSchema,
});

const RoleSchema = z.object({
  rolenew: z.object({
    name: z.string(),
  }),
});

const SupervisaoPertenceSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const SituacaoNoReinoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const SupervisorSchema = z.object({
  id: z.string().uuid(),
  role: z.string(),
  discipulador: z.array(DiscipuladorSchema),
  discipulos: z.array(DiscipulosSchema),
  user_roles: z.array(RoleSchema),
  image_url: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  batizado: z.boolean(),
  is_discipulado: z.boolean(),
  discipuladorId: z.string().uuid(),
  supervisao_pertence: SupervisaoPertenceSchema,
  celula: z.null(),
  celula_lidera: z.array(z.unknown()), // Assuming celula_lidera is an array of unknown items
  situacao_no_reino: SituacaoNoReinoSchema,
  cargo_de_lideranca: CargoDeLiderancaSchema,
});

export type TSupervisor = z.infer<typeof SupervisorSchema>


export interface UpdateSupervisorProps2 {
  discipulo: TSupervisor,
  supervisor: TSupervisor
}

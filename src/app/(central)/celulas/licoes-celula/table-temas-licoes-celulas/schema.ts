import { z } from "zod";

export const temaSchemaTable =
  z.object({
    tema: z.string().uuid(),
    date: z.object({
      from: z.string(),
      to: z.string(),
    }),
  });

export type TUser = z.infer<typeof temaSchemaTable>;

export const allTemaReturnSchemaTable =
  z.object({
    id: z.string().uuid(),
    status: z.boolean(),
    tema: z.string(),
    data_inicio: z.string(),
    data_termino: z.string()
  });

export type AllTemaReturn = z.infer<typeof allTemaReturnSchemaTable>;

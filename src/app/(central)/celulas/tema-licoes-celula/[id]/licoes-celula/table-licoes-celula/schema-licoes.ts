import { z } from "zod";

export const licaoSchemaTable =
  z.object({
    titulo: z.string(),
    versiculo_chave: z.string(),
    pdfFile: z.instanceof(FileList),
    date: z.object({
      from: z.string(),
      to: z.string(),
    }),
  });

export type TLicoesForm = z.infer<typeof licaoSchemaTable>;

export const allLicaoReturnSchemaTable =
  z.object({
    id: z.string().uuid(),
    licao_lancando_redes: z.boolean(),
    titulo: z.string(),
    versiculo_chave: z.string(),
    link_objeto_aws: z.string(),
    data_inicio: z.string(),
    data_termino: z.string()
  });

export type AllLicaoReturn = z.infer<typeof allLicaoReturnSchemaTable>;

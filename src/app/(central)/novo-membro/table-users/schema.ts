import { z } from "zod";

const discipuladorUsuarioSchema = z.object({
  user_discipulador_usuario_discipulador_idTouser: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
  }),
});

const supervisaoPertenceSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const celulaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const situacaoNoReinoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const cargoDeLiderancaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const escolaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

const encontroSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
});

export const userSchemaTable = z.object({
  id: z.string().uuid(),
  role: z.enum(["MEMBER"]),
  discipulador_usuario_discipulador_usuario_usuario_idTouser: z.array(
    discipuladorUsuarioSchema,
  ),
  discipulador_usuario_discipulador_usuario_discipulador_idTouser: z.array(
    z.unknown(),
  ),
  user_roles: z.array(z.unknown()),
  image_url: z.string().nullable(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  date_nascimento: z.string().datetime().nullable(),
  sexo: z.enum(["F", "M"]),
  telefone: z.string(),
  batizado: z.boolean(),
  date_batizado: z.string().datetime().nullable(),
  is_discipulado: z.boolean(),
  discipuladorId: z.string().uuid(),
  supervisao_pertence: supervisaoPertenceSchema,
  celula: celulaSchema,
  celula_lidera: z.array(z.unknown()),
  situacao_no_reino: situacaoNoReinoSchema,
  cargo_de_lideranca: cargoDeLiderancaSchema,
  escolas: z.array(escolaSchema),
  encontros: z.array(encontroSchema),
  presencas_aulas_escolas: z.array(z.unknown()),
});

// Validando um objeto
// const data = {
//   id: "25c9929e-0ef9-49f3-a46f-7eba5e409e56",
//   role: "MEMBER",
//   discipulador_usuario_discipulador_usuario_usuario_idTouser: [
//     {
//       user_discipulador_usuario_discipulador_idTouser: {
//         id: "de0f4160-02a5-416a-8920-a3971ad5127f",
//         first_name: "Yasmin Vitória",
//       },
//     },
//   ],
//   discipulador_usuario_discipulador_usuario_discipulador_idTouser: [],
//   user_roles: [],
//   image_url: null,
//   email: "lilianvitriateste@teste.com",
//   first_name: "Lilian Vitória",
//   last_name: "",
//   date_nascimento: "0001-01-01T00:00:00.000Z",
//   sexo: "F",
//   telefone: "(00)00000-0000",
//   batizado: false,
//   date_batizado: "0001-01-01T00:00:00.000Z",
//   is_discipulado: true,
//   discipuladorId: "de0f4160-02a5-416a-8920-a3971ad5127f",
//   supervisao_pertence: {
//     id: "0c885f70-f073-4827-a0ed-1a6bc3e20d5c",
//     nome: "verde",
//   },
//   celula: {
//     id: "bd179eff-b96a-4f43-b58c-93e4c319a8f6",
//     nome: "Peniel",
//   },
//   celula_lidera: [],
//   situacao_no_reino: {
//     id: "f4c1c9ee-5f5a-4681-af13-99c422c240e0",
//     nome: "Normal",
//   },
//   cargo_de_lideranca: {
//     id: "079e35a7-8e9c-40ef-9d5b-cb8f9c7c11a8",
//     nome: "Membro",
//   },
//   escolas: [
//     {
//       id: "0b903e64-1bf2-4547-be88-35c61818290e",
//       nome: "Princípios",
//     },
//     {
//       id: "77fc641d-ad4c-4869-b7a2-42e0d26262f7",
//       nome: "Fundamentos",
//     },
//   ],
//   encontros: [
//     {
//       id: "f54fa0a4-0d1e-4638-8dc0-9c42b2000a49",
//       nome: "Com Deus",
//     },
//   ],
//   presencas_aulas_escolas: [],
// };

// try {
//   userSchema.parse(data);
//   console.log("Validação bem-sucedida!");
// } catch (error) {
//   console.error("Erro na validação:", error);
// }

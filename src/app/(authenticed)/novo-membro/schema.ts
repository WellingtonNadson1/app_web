/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const MemberSchema = z

  .object({
    first_name: z.string(),
    last_name: z.string(),
    cpf: z.string(),
    date_nascimento: z.date(),
    sexo: z.string(),
    email: z.string().email(),
    telefone: z.string(),
    escolaridade: z.string(),
    profissao: z.string(),
    batizado: z.boolean(),
    date_batizado: z.date(),
    is_discipulado: z.boolean(),
    discipulador: z.string(),
    supervisao_pertence: z.string(),
    situacao_no_reino: z.string(),
    celula: z.string(),
    escolas: z.string(),
    encontros: z.string().array(),
    estado_civil: z.string().array(),
    nome_conjuge: z.string(),
    date_casamento: z.date(),
    date_decisao: z.date(),
    has_filho: z.boolean(),
    quantidade_de_filho: z.number(),
    cep: z.string().min(9, 'Preencha o CEP com no mínimo 9 caracteres'),
    estado: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    endereco: z.string(),
    numberHouse: z.string()
  })
  .transform((obj) => ({
    first_name: obj.first_name,
    last_name: obj.last_name,
    cpf: obj.cpf,
    date_nascimento: obj.date_nascimento,
    sexo: obj.sexo,
    email: obj.email,
    telefone: obj.telefone,
    escolaridade: obj.escolaridade,
    profissao: obj.profissao,
    batizado: obj.batizado,
    date_batizado: obj.date_batizado,
    is_discipulado: obj.is_discipulado,
    discipulador: obj.discipulador,
    supervisao_pertence: obj.supervisao_pertence,
    situacao_no_reino: obj.situacao_no_reino,
    celula: obj.celula,
    escolas: obj.escolas,
    encontros: obj.encontros,
    estado_civil: obj.estado_civil,
    nome_conjuge: obj.nome_conjuge,
    date_casamento: obj.date_casamento,
    date_decisao: obj.date_decisao,
    has_filho: obj.has_filho,
    quantidade_de_filho: obj.quantidade_de_filho,
    cep: obj.cep,
    estado: obj.estado,
    cidade: obj.cidade,
    bairro: obj.bairro,
    endereco: obj.endereco,
    numberHouse: obj.numberHouse
  }));

  export const EscolasSchema = z
  .object({
    id: z.string(),
    nome: z.string()
  })
  .array();

  export const EncontrosSchema = z
  .object({
    id: z.string(),
    nome: z.string()
  })
  .array();

  export const SituacoesNoReinoSchema = z
  .object({
    id: z.string(),
    nome: z.string()
  })
  .array();


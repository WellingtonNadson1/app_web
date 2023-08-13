/* eslint-disable prettier/prettier */
import { z } from 'zod';
import { EncontrosSchema, EscolasSchema, MemberSchema, SituacoesNoReinoSchema } from './schema';

export type Member = z.infer<typeof MemberSchema>;

export type AddressProps = {
  uf: string;
  bairro: string;
  logradouro: string;
  complemento: string;
  localidade: string;
};

export type Escolas = z.infer<typeof EscolasSchema>;

export type Encontros = z.infer<typeof EncontrosSchema>;

export type SituacoesNoReino = z.infer<typeof SituacoesNoReinoSchema>;

interface Celula {
  id: string;
  nome: string;
}

export interface SupervisaoData {
  id: string;
  nome: string;
  celulas: Celula[];
}

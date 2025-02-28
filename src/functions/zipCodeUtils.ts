import {
  AddressProps,
  Member,
} from '@/app/(private)/(central)/central/novo-membro/schema';
import { UseFormSetValue } from 'react-hook-form';

type FlexibleSetValue = UseFormSetValue<Member>;

export const handleZipCode = async (
  e: React.FormEvent<HTMLInputElement>,
  setValue: FlexibleSetValue,
) => {
  const handleSetDataAddress = (data: AddressProps) => {
    if (data.localidade) setValue('cidade', data.localidade);
    if (data.logradouro) setValue('endereco', data.logradouro);
    if (data.uf) setValue('estado', data.uf);
    if (data.bairro) setValue('bairro', data.bairro);
  };

  const handleFetchCep = async (zipCode: string) => {
    try {
      const cleanZipCode = zipCode.replace('-', '');
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanZipCode}/json/`,
      );
      const result = await response.json();
      handleSetDataAddress(result);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  e.currentTarget.maxLength = 9;
  let value = e.currentTarget.value;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  e.currentTarget.value = value;

  if (value.length === 9) {
    await handleFetchCep(value);
  }
};

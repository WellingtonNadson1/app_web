import { useForm, UseFormSetValue } from 'react-hook-form';
import { AddressProps, Member } from '@/app/(central)/novo-membro/schema';

type FlexibleSetValue = UseFormSetValue<Member>;

export const handleZipCode = async (
  e: React.FormEvent<HTMLInputElement>,
  setValue: FlexibleSetValue,
) => {
  const handleSetDataAddress = (data: AddressProps) => {
    setValue('cidade', data.localidade);
    setValue('endereco', data.logradouro);
    setValue('estado', data.uf);
    setValue('bairro', data.bairro);
  };

  const handleFetchCep = async (zipCode: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
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

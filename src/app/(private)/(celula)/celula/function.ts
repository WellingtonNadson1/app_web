'use client';
import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { z } from 'zod';

const reuniaoCelulaDataSchema2 = z.object({
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string().nullable(),
});

type reuniaoCelulaData2 = z.infer<typeof reuniaoCelulaDataSchema2>;

export const createReuniao = (celulaId: string) => {
  const [reuniaoRegisteredId, setReuniaRegisteredId] = useState<string>();
  const hostname = 'back-ibb.vercel.app';
  const URLReuniaoCelula = `https://${hostname}/reunioessemanaiscelulas`;

  const queryClient = useQueryClient();

  const createReuniaoCelula = async (
    dataSend: reuniaoCelulaData2,
  ): Promise<
    {
      status: string;
      celula: string;
      data_reuniao: string;
      presencas_membros_reuniao_celula: string;
      id?: string | undefined;
    }[]
  > => {
    const response = await api.post(URLReuniaoCelula, dataSend);
    console.log(response);
    return response.data;
  };

  const {
    mutate,
    data: dataMutate,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: createReuniaoCelula,
    onSuccess: async (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['reuniaocelula'] });
      console.log('success mutate', responseData);
      setReuniaRegisteredId(responseData[0].id);
    },
    onError: async (errorData) => {
      const axiosError = errorData as AxiosError;
      if (axiosError.response) {
        const errorResponseData = axiosError.response.data;
        if (Array.isArray(errorResponseData) && errorResponseData.length > 0) {
          // Access the 'id' from the first element in the array (assuming it's the only one)
          const id = errorResponseData[0].id;
          setReuniaRegisteredId(id);
          // Now you can use 'id' in other parts of your code
          console.log('Error Response ID:', id);
        }
      } else {
        console.error('Error response is not available');
      }
    },
  });
};

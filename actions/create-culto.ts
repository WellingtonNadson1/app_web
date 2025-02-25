'use server';

import { auth } from '@/auth';
import { BASE_URL } from '@/lib/axios';
import axios from 'axios';
import { revalidatePath } from 'next/cache';

export async function createcultosTest(formaData: FormData) {
  console.log({ formaData });
  const data_inicio_culto = formaData.get('data_inicio_culto') as string;
  const data_termino_culto = formaData.get('data_termino_culto') as string;
  const culto_semana = formaData.get('culto_semana') as string;
  const status = formaData.get('status') as string;
  const session = await auth();
  const URLCultosIndividuais = `${BASE_URL}/cultosindividuais`;
  const token = session?.user?.token;

  const axiosAuth = axios.create({
    baseURL: 'https://back-ibb.vercel.app',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const response = axiosAuth.post(URLCultosIndividuais, {
    data_inicio_culto,
    data_termino_culto,
    culto_semana,
    status,
  });
  const cultoIsRegister = response.then((data) => console.log({ data }));

  revalidatePath('/(central)/cultos');
}

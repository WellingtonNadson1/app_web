'use client'
import SpinnerButton from "@/components/spinners/SpinnerButton"
import { BASE_URL } from "@/functions/functions"
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface Membro {
  id: string;
  first_name: string;
  celula: {
      nome: string;
  };
}

interface PresencaCulto {
  id: string;
  data_inicio_culto: string;
  data_termino_culto: string;
  status: string;
  cultoSemanalId: string;
  date_create: string;
  date_update: string;
}

interface Dados {
  id: string;
  status: boolean;
  userId: string;
  cultoIndividualId: string;
  membro: Membro;
  presenca_culto: PresencaCulto;
  date_create: string;
  date_update: string;
}

const MokupFrequenciaCulto = () => {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const { data: presencas, isLoading, isError } = useQuery<Dados[]>({
    queryKey: ['presencaCultos'],
    queryFn: () =>
    axiosAuth.get(`${BASE_URL}/presencacultos`),
  })
  console.log('Presencas: ', presencas)
  return (
    <>
      {isLoading ? (
        <p><SpinnerButton /></p>
      ) : (
        <>
          {presencas && presencas?.map((presenca) => (
            <div key={presenca.id} className="px-2 py-2 mt-3">
              <h2>{presenca.membro.celula.nome}</h2>
              <p>{presenca.membro.first_name}</p>
              <p>{presenca.presenca_culto.data_inicio_culto}</p>
              <p>{presenca.status}</p>
            </div>

          ))}
        </>
      )}
    </>
  )
}

export default MokupFrequenciaCulto

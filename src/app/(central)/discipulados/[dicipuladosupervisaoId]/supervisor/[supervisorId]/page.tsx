'use client'
import { useCombinetedStore } from '@/store/DataCombineted'
import { useUserDataStore } from '@/store/UserDataStore'
import { useParams } from 'next/navigation'
import ListMembersDiscipuladoSupervisor from '../../../Components/ListMembersDiscipuladoSupervisor'

export default function ControleDiscipuladoSupervisior({
  params: { supervisorId },
}: {
  params: { supervisorId: string }
}) {
  const { token } = useUserDataStore.getState()
  const { supervisoes } = useCombinetedStore.getState().state

  const id = useParams()

  console.log('id', id)

  const supervisao = supervisoes?.filter(supervisao => supervisao.id === id.supervisorId)

  const data = supervisao

  console.log('supervisoes Filter', supervisoes)
  console.log('supervisao Filtrada', supervisao)

  // const axiosAuth = useAxiosAuthToken(token)

  // const URL = `${BASE_URL}/celulas/${celulaId}`

  // const CelulaDataQuery = async () => {
  //   try {
  //     const { data } = await axiosAuth.get(URL)
  //     return data
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       console.error(error.response.data)
  //     } else {
  //       console.error(error)
  //     }
  //   }
  // }

  // const { data: celula, isError: error, isLoading, isSuccess } = useQuery<CelulaDataDiscipulado>({
  //   queryKey: ["celula"],
  //   queryFn: CelulaDataQuery,
  //   retry: 3
  // })

  // if (error) {
  //   return (
  //     <div className="w-full px-2 py-2 mx-auto">
  //       <div className="w-full mx-auto">
  //         <div>failed to load</div>
  //       </div>
  //     </div>
  //   )
  // }

  // if (isLoading) {
  //   return (
  //     <div className="w-full px-2 py-2 mx-auto">
  //       <div className="flex items-center w-full gap-2 mx-auto">
  //         <div className="text-white">carregando...</div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto">
      </div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {/* {isSuccess && */}
        <ListMembersDiscipuladoSupervisor supervisor={supervisao[0]?.supervisor} />
        {/* } */}
      </div>
    </div>
  )
}

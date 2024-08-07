'use client'
import { columns } from '@/app/(central)/novo-membro/table-users/columns'
import { DataTableUsers } from '@/app/(central)/novo-membro/table-users/data-table-users'
import { CelulaData } from '@/components/listMembersCelula'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function ControleCelulaSupervision({
  params: { celulaId },
}: {
  params: { celulaId: string }
}) {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const URL = `${BASE_URL}/celulas/${celulaId}`

  const CelulaDataQuery = async () => {
    try {
      const { data } = await axiosAuth.get(URL)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: celula, isError: error, isLoading, isSuccess } = useQuery<CelulaData>({
    queryKey: ["celula"],
    queryFn: CelulaDataQuery,
    retry: 3
  })

  if (error) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto">
          <div>failed to load</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="flex items-center w-full gap-2 mx-auto">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto">
        {/* <Header titlePage={`Célula ${data?.nome}`} /> */}
      </div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {isSuccess &&
          <DataTableUsers columns={columns} data={celula.membros as any} />
          // <ListMembersCelula data={celula} />
        }
      </div>
      {/* <div className="relative w-full px-2 mx-auto mb-4">
        <LicoesCelula />
      </div> */}
      {/* <div className="relative w-full px-2 mx-auto mb-4">
        <ControlePresenca />
      </div> */}
    </div>
  )
}

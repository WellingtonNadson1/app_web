'use client'
import { BASE_URL_LOCAL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { columns } from '../table-discipulos-supervisor/columns'
import { DataTableDiscipulosSUpervisor } from '../table-discipulos-supervisor/data-table-discipulos-supervisor'
import TableSkeletonDiscipulosSupervisor from './table-skeleton'

export default function ControleDiscipuladoSupervisior() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)

  const URLDiscipulosSupervisor = `${BASE_URL_LOCAL}/users/alldiscipulossupervisor`

  const { dicipuladosupervisaoId, supervisorId } = useParams()

  console.log('Params:', dicipuladosupervisaoId, supervisorId);

  const getDiscipuloSupervisorBySupervisor = async () => {
    const { data } = await axiosAuth.post(URLDiscipulosSupervisor, {
      dicipuladosupervisaoId,
      supervisorId
    })
    return data
  }

  const {
    data: supervisor,
    isLoading,
    isPending,
    isSuccess,
    error,
  } = useQuery<any>({
    queryKey: ['discipulosSupervisor', dicipuladosupervisaoId, supervisorId],
    queryFn: getDiscipuloSupervisorBySupervisor,
    enabled: !!dicipuladosupervisaoId && !!supervisorId, // Só executa a query se os parâmetros estiverem definidos
  })

  console.log('supervisor final', supervisor)

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto"></div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        <div className='flex flex-col gap-3'>
          {
            isLoading || isPending ?
              (<TableSkeletonDiscipulosSupervisor />) :
              (supervisor &&
                <DataTableDiscipulosSUpervisor
                  columns={columns}
                  supervisor={supervisor[0]?.discipulador[0]?.user_discipulador
                    ?.first_name}
                  data={supervisor as any} />)
          }
          {/* <ListMembersDiscipuladoSupervisor
              //@ts-ignore
              supervisor={supervisao[0]?.supervisor}
            /> */}
        </div>
      </div>
    </div>
  )
}

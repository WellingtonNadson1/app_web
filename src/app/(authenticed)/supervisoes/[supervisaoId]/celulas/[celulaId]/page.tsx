'use client'
import ListMembersCelula, { CelulaData } from '@/components/listMembersCelula'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

export default function ControleCelulaSupervision({
  params: { celulaId },
}: {
  params: { celulaId: string }
}) {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  console.log(useParams())
  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/celulas/${celulaId}`

  const CelulaData = async () => {
    try {
      const response = await axiosAuth.get(URL)
      return await response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: celula, isError: error, isLoading } = useQuery<CelulaData>({
    queryKey: ["celula"],
    queryFn: CelulaData
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
  console.log(JSON.stringify(celula))

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
        {celula &&
          <ListMembersCelula data={celula} />
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

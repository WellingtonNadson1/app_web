'use client'
import ListMembersCelula, { CelulaData, ListMembersCelulaProps } from '@/components/listMembersCelula'
import { fetchWithToken } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'

export default function ControleCelulaSupervision({
  params: { celulaId },
}: {
  params: { celulaId: string }
}) {
  const { data: session } = useSession()
  console.log(useParams())
  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/celulas/${celulaId}`
  
  const {
    data: celula,
    error,
    isValidating,
    isLoading,
  } = useSWR<CelulaData>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
    )
    
  if (error) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div>failed to load</div>
        </div>
      </div>
    )
  }
  console.log(JSON.stringify(celula))

  if (isLoading) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )
  }

  if (isValidating) {
    console.log('Is Validating', isValidating)
    console.log('Celulal Data: ', celula)
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto w-full">
        {/* <Header titlePage={`Célula ${data?.nome}`} /> */}
      </div>
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        {celula &&
          <ListMembersCelula data={celula} />
        }
      </div>
      {/* <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div> */}
      {/* <div className="relative mx-auto mb-4 w-full px-2">
        <ControlePresenca />
      </div> */}
    </div>
  )
}

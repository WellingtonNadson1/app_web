/* eslint-disable camelcase */
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { auth } from '@/auth'
import { axiosAuthToken } from '@/lib/axios'
import axios from 'axios'
import ListMembersCelulaDiscipulado from '../components/listMembersCelulaDiscipulado'
import HeaderCelulaDiscipulados from './HeaderCelulaDiscipulados'

export default async function DiscipuladosCelula() {
  const session = await auth()
  const token = session?.user?.token

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const celulaId = session?.user?.celulaId
  // const URLCelula = `https://backibb-production.up.railway.app/celulas/${celulaId}`
  // const URLCelula = `https://app-ibb.onrender.com/celulas/${celulaId}`;
  const URLCelula = `https://back-ibb.vercel.app/celulas/${celulaId}`

  const CelulaData = async () => {
    try {
      const { data } = await axiosAuthToken.get(URLCelula, config)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const celula = await CelulaData()

  return (
    <>
      <div className="relative w-full px-1 py-2 mx-auto">
        <div className="relative w-full mx-auto">
          <HeaderCelulaDiscipulados headerCelula={celula?.nome} />
        </div>
        <div className="relative flex flex-col w-full gap-3 px-1 mx-auto mt-3 mb-4">
          {celula && <ListMembersCelulaDiscipulado data={celula} />}
        </div>
      </div>
    </>
  )
}

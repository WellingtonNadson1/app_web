/* eslint-disable camelcase */
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { axiosAuthToken } from '@/lib/axios'
import HeaderDiscipuladosSupervisor from './HeaderDiscipuladosSupervisor'
import ListMembersSupervisorDiscipulado from '../components/listMembersSupervisorDiscipulado'

export default async function DiscipuladosSupervisor() {

  const session = await getServerSession(authOptions)
  const token = session?.user?.token
  const id = session?.user?.id

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const URLUser = `https://app-ibb.onrender.com/users/cell/${id}`

  const UserData = async () => {
    try {
      const { data } = await axiosAuthToken.get(URLUser, config)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const user = await UserData()

  return (
    <>
      <div className="relative w-full px-2 py-2 mx-auto">
        <div className="relative w-full mx-auto">
          <HeaderDiscipuladosSupervisor headerSupervisao={user?.supervisao_pertence?.nome} />
        </div>
        <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mt-3 mb-4">
          {user && <ListMembersSupervisorDiscipulado data={user} />}
        </div>
      </div>
    </>
  )
}

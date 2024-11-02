/* eslint-disable camelcase */
import { auth } from '@/auth'
import { axiosAuthToken } from '@/lib/axios'
import axios from 'axios'
import ListMembersSupervisorDiscipulado from '../components/listMembersSupervisorDiscipulado'
import HeaderDiscipuladosSupervisor from './HeaderDiscipuladosSupervisor'

export default async function DiscipuladosSupervisor() {
  const session = await auth()
  const token = session?.user?.token
  const id = session?.user?.id

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const URLUser = `https://back-ibb.vercel.app/users/cell/${id}`

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
      <div className="relative w-full px-1 py-2 mx-auto">
        <div className="relative w-full mx-auto">
          <HeaderDiscipuladosSupervisor
            headerSupervisao={user?.supervisao_pertence?.nome}
          />
        </div>
        <div className="relative flex flex-col w-full gap-3 px-1 mx-auto mt-3 mb-4">
          {user && <ListMembersSupervisorDiscipulado data={user} />}
        </div>
      </div>
    </>
  )
}

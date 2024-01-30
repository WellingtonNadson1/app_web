// "use client"
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getServerSession } from 'next-auth';
import MainSide from '@/components/MainSide'
import axios from 'axios';
import { useCombinetedStore } from '@/store/DataCombineted';
import { InitializerStore } from '@/store/InitializerStore';
import { InitializerUserStore } from '@/store/InitializerUserStore';

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const id = session?.user.id
  const role = session?.user.role
  const email = session?.user.token
  const image_url = session?.user.image_url
  const first_name = session?.user.first_name
  const token = session?.user.token
  const refreshToken = session?.user.refreshToken

  const axiosAuth = axios.create({
    baseURL: 'https://app-ibb.onrender.com',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  const DataCombinetedt = async () => {
    try {
      const { data } = await axiosAuth.get('/users/all')
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const result = await DataCombinetedt()

  useCombinetedStore.setState({
    state: {
      supervisoes: result[0] ?? [],
      escolas: result[1] ?? [], // Adicione esta linha
      encontros: result[2] ?? [], // Adicione esta linha
      situacoesNoReino: result[3] ?? [], // Adicione esta linha
      cargoLideranca: result[4] ?? [], // Adicione esta linha
    }
  })

  return (
    <>
      <div className="w-full px-2 py-2 mx-auto">
        <InitializerStore
          supervisoes={result[0] ?? []}
          escolas={result[1] ?? []}
          encontros={result[2] ?? []}
          situacoesNoReino={result[3] ?? []}
          cargoLideranca={result[4] ?? []}
        />
        <InitializerUserStore
          id={id ?? ''}
          role={role ?? ''}
          email={email ?? ''}
          image_url={image_url ?? ''}
          first_name={first_name ?? ''}
          token={token ?? ''}
          refreshToken={refreshToken ?? { id: '', expiresIn: 0, userIdRefresh: '' }}
        />
        <MainSide />
      </div>
    </>
  )
}

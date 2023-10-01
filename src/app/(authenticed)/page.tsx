import MainSide from '@/components/MainSide'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <>
      <div className="mx-auto w-full px-2 py-2">
        <div>{session?.user.first_name}</div>
        <MainSide />
      </div>
    </>
  )
}

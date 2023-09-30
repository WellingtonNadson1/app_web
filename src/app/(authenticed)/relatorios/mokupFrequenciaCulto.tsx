'use client'
import SpinnerButton from "@/components/spinners/SpinnerButton"
import { BASE_URL } from "@/functions/functions"
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

const MokupFrequenciaCulto = () => {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const { data: presencas, isLoading, isError } = useQuery<[]>({
    queryKey: ['presencaCultos'],
    queryFn: () =>
    axiosAuth.get(`${BASE_URL}/presencacultos`),
  })
  return (
    <>
      {isLoading ? (
        <p><SpinnerButton /></p>
      ) : (
        <>
          {presencas?.map((presenca, index) => (
            <div key={index}>{presenca}</div>

          ))}
        </>
      )}
    </>
  )
}

export default MokupFrequenciaCulto

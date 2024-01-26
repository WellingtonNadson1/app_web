'use client'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone"
import ptBr from "dayjs/locale/pt-br"
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { SubmitHandler, useForm } from 'react-hook-form'
import { errorCadastro, success } from '@/functions/functions'
import { NewCulto } from '@/app/(authenticed)/cultos/schemaNewCulto'
dayjs.extend(localizedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);

export default function StatsCardRelatoriosSupervisores() {
  const { data: session } = useSession()
  const { register, handleSubmit, reset } = useForm()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const hostname = 'app-ibb.onrender.com'
  const URLPresencaGeralCultos = `https://${hostname}/relatorio/presencacultos`
  // const URLPresencaGeralCultos = `http://localhost:3333/relatorio/presencacultos`

  const onSubmit: SubmitHandler<NewCulto> = async (data) => {

    try {

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data.data_inicio_culto = formatDatatoISO8601(data.data_inicio_culto)
      data.data_termino_culto = formatDatatoISO8601(data.data_termino_culto)

      const response = await axiosAuth.post(URLPresencaGeralCultos, {
        data
      })

      const cultoIsRegister = response.data

      if (cultoIsRegister) {

        success('😉 Culto Cadastrado')
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      } else {


        errorCadastro('Erro ao cadastrar Culto')
      }
    } catch (error) {
      console.log(error)

      errorCadastro('😰 Erro ao cadastrar Culto')
    }
    reset()
  }

  return (
    <>

    </>
  )
}

/* eslint-disable prettier/prettier */
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MemberSchema } from "./schema"
import { AddressProps, Member } from "./types"

export const useCep = () => {
  const { register: registerCep, handleSubmit: handleSubmitCep, setValue, watch } =
    useForm<Member>({
      resolver: zodResolver(MemberSchema),
    })
  const zipCode = watch('cep')

  const handleSetDataAddress = useCallback(
    (data: AddressProps) => {
      setValue('cidade', data.localidade)
      setValue('endereco', data.logradouro)
      setValue('estado', data.uf)
      setValue('bairro', data.bairro)
    },
    [setValue],
  )

  const handleFetchCep = useCallback(
    async (zipCode: string) => {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
      const result = await response.json()

      handleSetDataAddress(result)
    },
    [handleSetDataAddress],
  )

  useEffect(() => {
    if (!zipCode || zipCode.length !== 9) {
      return
    }

    const formattedCep = zipCodeMask(zipCode)
    setValue('cep', formattedCep)

    handleFetchCep(zipCode)
  }, [zipCode, setValue, handleFetchCep])

  function zipCodeMask(cep: string): string {
    const digits = cep.match(/\d/g)
    if (digits && digits.length === 9) {
      return `${digits.slice(0, 5).join('')}-${digits.slice(5).join('')}`
    } else {
      return cep // Mantém o valor original se for inválido
    }
  }

  return {
    handleSubmitCep,
    registerCep,
  }
}

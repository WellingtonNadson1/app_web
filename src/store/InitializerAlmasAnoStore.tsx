'use client'
import { useRef } from 'react'
import { useAlmasAnoStore } from './AlmasStorage'

type InitializerAlmasAnoStoreProps = {
  almasGanhasNoAno: number
}

export const InitializerAlmasAnoStore = ({
  almasGanhasNoAno,
}: InitializerAlmasAnoStoreProps) => {
  const initializerAlmasAno = useRef(false)

  if (!initializerAlmasAno.current) {
    useAlmasAnoStore.setState({
      almasGanhasNoAno,
    })
  }
  return null
}

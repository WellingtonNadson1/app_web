'use client'
import { useRef } from 'react'
import { useAlmasMesStore } from './AlmasStorage'

type InitializerAlmasMesStoreProps = {
  almasGanhasNoMes: number
}

export const InitializerAlmasMesStore = ({
  almasGanhasNoMes,
}: InitializerAlmasMesStoreProps) => {
  const initializerAlmasMes = useRef(false)

  if (!initializerAlmasMes.current) {
    useAlmasMesStore.setState({
      almasGanhasNoMes,
    })
  }
  return null
}

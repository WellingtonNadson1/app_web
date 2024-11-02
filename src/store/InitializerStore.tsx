'use client'

import {
  CargoLidereanca,
  Encontros,
  Escolas,
  SituacoesNoReino,
  SupervisaoData,
} from '@/app/(central)/novo-membro/schema'
import { useRef } from 'react'
import { useCombinedStore } from './DataCombineted'

type InitializerStoreProps = {
  supervisoes: SupervisaoData[]
  escolas: Escolas[]
  encontros: Encontros[]
  situacoesNoReino: SituacoesNoReino[]
  cargoLideranca: CargoLidereanca[]
}

export const InitializerStore = ({
  supervisoes,
  escolas,
  encontros,
  situacoesNoReino,
  cargoLideranca,
}: InitializerStoreProps) => {
  const initializer = useRef(false)

  if (!initializer.current) {
    useCombinedStore.setState({
      state: {
        supervisoes,
        escolas,
        encontros,
        situacoesNoReino,
        cargoLideranca,
      },
    })
  }
  return null
}

import {
  CargoLidereanca,
  Encontros,
  Escolas,
  SituacoesNoReino,
  SupervisaoData,
} from '@/app/(central)/novo-membro/schema'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ActionsProps = {
  setSupervisao: (supervisao: SupervisaoData) => void
  setEscola: (escola: Escolas) => void
  setEncontro: (encontro: Encontros) => void
  setSituacoesNoReino: (situacaoreino: SituacoesNoReino) => void
  setCargoLideranca: (cargolideranca: CargoLidereanca) => void
}

type CombinedDataStore = {
  state: {
    supervisoes: SupervisaoData[]
    escolas: Escolas[]
    encontros: Encontros[]
    situacoesNoReino: SituacoesNoReino[]
    cargoLideranca: CargoLidereanca[]
  }
  actions: ActionsProps
}

export const useCombinedStore = create(
  persist<CombinedDataStore>(
    (set) => ({
      state: {
        supervisoes: [],
        escolas: [],
        encontros: [],
        situacoesNoReino: [],
        cargoLideranca: [],
      },
      actions: {
        setSupervisao: (supervisao) =>
          set((state) => ({
            ...state,
            state: {
              ...state.state,
              supervisoes: [...state.state.supervisoes, supervisao],
            },
          })),

        setEscola: (escola) =>
          set((state) => ({
            ...state,
            state: {
              ...state.state,
              escolas: [...state.state.escolas, escola],
            },
          })),

        setEncontro: (encontro) =>
          set((state) => ({
            ...state,
            state: {
              ...state.state,
              encontros: [...state.state.encontros, encontro],
            },
          })),

        setSituacoesNoReino: (situacaoreino) =>
          set((state) => ({
            ...state,
            state: {
              ...state.state,
              situacoesNoReino: [
                ...state.state.situacoesNoReino,
                situacaoreino,
              ],
            },
          })),
        setCargoLideranca: (cargoLideranca) =>
          set((state) => ({
            ...state,
            state: {
              ...state.state,
              cargoLideranca: [...state.state.cargoLideranca, cargoLideranca],
            },
          })),
      },
    }),
    {
      name: 'data-combined',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

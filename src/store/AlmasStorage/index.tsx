"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Define a store para almas ganhas
type AlmasStoreMes = {
  almasGanhasNoMes: number;
  setAlmasGanhasNoMes: (almasGanhasNoMes: number) => void;
};
type AlmasStoreAno = {
  almasGanhasNoAno: number;
  setAlmasGanhasNoAno: (almasGanhasNoAno: number) => void;
};

export const useAlmasMesStore = create(
  persist<AlmasStoreMes>(
    (set) => ({
      almasGanhasNoMes: 0,
      setAlmasGanhasNoMes: (almasGanhasNoMes) => {
        console.log("Atualizando almasGanhasNoMes:", almasGanhasNoMes);
        set({ almasGanhasNoMes });
      },
    }),
    {
      name: "data-almas",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useAlmasAnoStore = create(
  persist<AlmasStoreAno>(
    (set) => ({
      almasGanhasNoAno: 0,
      setAlmasGanhasNoAno: (almasGanhasNoAno) => {
        console.log("Atualizando almasGanhasNoAno:", almasGanhasNoAno);
        set({ almasGanhasNoAno });
      },
    }),
    {
      name: "data-almas-ano",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

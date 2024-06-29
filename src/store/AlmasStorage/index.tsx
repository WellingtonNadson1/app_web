"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define a store para almas ganhas
type AlmasStore = {
  almasGanhasNoMes: number;
  setAlmasGanhasNoMes: (almasGanhasNoMes: number) => void;
};

export const useAlmasStore = create(
  persist<AlmasStore>(
    (set) => ({
      almasGanhasNoMes: 0,
      setAlmasGanhasNoMes: (almasGanhasNoMes) => set({ almasGanhasNoMes }),
    }),
    {
      name: "data-almas",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

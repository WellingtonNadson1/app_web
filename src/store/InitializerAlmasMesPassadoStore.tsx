"use client";
import { useRef } from "react";
import { useAlmasMesPassadoStore } from "./AlmasStorage";

type InitializerAlmasMesPassadoStoreProps = {
  almasGanhasNoMesPassado: number;
};

export const InitializerAlmasMesPassadoStore = ({
  almasGanhasNoMesPassado
}: InitializerAlmasMesPassadoStoreProps) => {
  const initializerAlmasMesPassado = useRef(false);

  if (!initializerAlmasMesPassado.current) {
    useAlmasMesPassadoStore.setState({
      almasGanhasNoMesPassado
    });
  }
  return null;
};

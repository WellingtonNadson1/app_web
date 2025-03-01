'use client';
import { useRef } from 'react';
import { useAlmasAnoPassadoStore } from './AlmasStorage';

type InitializerAlmasAnoPassadoStoreProps = {
  almasGanhasNoAnoPassado: number;
};

export const InitializerAlmasAnoPassadoStore = ({
  almasGanhasNoAnoPassado,
}: InitializerAlmasAnoPassadoStoreProps) => {
  const initializerAlmasAnoPassado = useRef(false);

  if (!initializerAlmasAnoPassado.current) {
    useAlmasAnoPassadoStore.setState({
      almasGanhasNoAnoPassado,
    });
  }
  return null;
};

"use client";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";
import { DataCombineted } from "./schema";

interface IProps {
  children: React.ReactNode;
}

interface DataContextType {
  data: DataCombineted | undefined;
  error: unknown;
  isLoading: boolean;
}

// Crie o contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Crie um hook para facilitar o uso do contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

const queryClient = new QueryClient();

const DataProvider = ({ children }: IProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user.token as string);

  const fetchDataFunction = async () => {
    const response = await axiosAuth.get(`${BASE_URL}/users/all`);
    return response.data as DataCombineted;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["dataKey"],
    queryFn: fetchDataFunction,
    enabled: !!session, // Só executa a query se a sessão existir
  });
  return (
    <DataContext.Provider value={{ data, error, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const Providers = ({ children }: IProps) => (
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        {children}
      </DataProvider>
    </QueryClientProvider>
  </SessionProvider>
);

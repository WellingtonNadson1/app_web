"use client";
import { SessionProvider, useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

// Crie o contexto
const DataContext = createContext({});

// Crie um hook para facilitar o uso do contexto
export const useData = () => useContext(DataContext);

interface IProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const DataProvider = ({ children }: IProps) => {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user.token as string);

  const fetchDataFunction = async () => {
    const response = await axiosAuth.get("/users/all");
    console.log(response.data);
    return response.data;
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

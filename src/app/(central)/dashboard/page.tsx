import { auth } from "@/auth";
import axios from "axios";
import ClientDashboard from "./ClientDashboard";

// Função que roda no servidor para obter os dados
async function fetchServerData() {
  const session = await auth();
  const token = session?.user.token;
  const DataCombinetedt = async () => {
    const axiosAuth = axios.create({
      baseURL: "https://back-ibb.vercel.app",
      // baseURL: "http://0.0.0.0:8080",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    try {
      const { data } = await axiosAuth.get("/users/all");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
      return null;
    }
  };

  const result = await DataCombinetedt();

  if (!result) {
    return {
      error: "Failed to fetch data",
    };
  }

  return {
    session,
    result,
  };
}

export default async function DashboardPage() {
  const { session, result, error } = await fetchServerData();
  if (error) {
    return <div>Error fetching data: {error}</div>;
  }
  // @ts-ignore
  return (<ClientDashboard session={session} result={result} />);
}

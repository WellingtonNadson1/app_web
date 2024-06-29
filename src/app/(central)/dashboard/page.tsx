// "use client"
import axios from "axios";
import MainSide from "@/components/MainSide";
import { useCombinetedStore } from "@/store/DataCombineted";
import { InitializerStore } from "@/store/InitializerStore";
import { InitializerUserStore } from "@/store/InitializerUserStore";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  const id = session?.user.id;
  const role = session?.user.role;
  const user_roles = session?.user.user_roles;
  const email = session?.user.token;
  const image_url = session?.user.image_url;
  const first_name = session?.user.first_name;
  const token = session?.user.token;
  const refreshToken = session?.user.refreshToken;

  const axiosAuth = axios.create({
    // baseURL: 'https://app-ibb.onrender.com',
    baseURL: "https://back-ibb.vercel.app",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const DataCombinetedt = async () => {
    try {
      const { data } = await axiosAuth.get("/users/all");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const result = await DataCombinetedt();

  if (!result) {
    // Handle the case where data is not fetched
    // You might redirect to an error page or display a loading message
    console.error("Failed to fetch data");
    return <div>Error fetching data</div>; // Or redirect, etc.
  }

  useCombinetedStore.setState({
    state: {
      supervisoes: result[0] ?? [],
      escolas: result[1] ?? [], // Adicione esta linha
      encontros: result[2] ?? [], // Adicione esta linha
      situacoesNoReino: result[3] ?? [], // Adicione esta linha
      cargoLideranca: result[4] ?? [], // Adicione esta linha
    },
  });

  return (
    <>
      <div className="w-full px-2 py-2 mx-auto">
        <InitializerUserStore
          id={id ?? ""}
          role={role ?? ""}
          user_roles={user_roles ?? []}
          email={email ?? ""}
          image_url={image_url ?? ""}
          first_name={first_name ?? ""}
          token={token ?? ""}
          refreshToken={
            refreshToken ?? { id: "", expiresIn: 0, userIdRefresh: "" }
          }
        />
        <InitializerStore
          supervisoes={result[0] ?? []}
          escolas={result[1] ?? []}
          encontros={result[2] ?? []}
          situacoesNoReino={result[3] ?? []}
          cargoLideranca={result[4] ?? []}
        />

        <MainSide />
      </div>
    </>
  );
}

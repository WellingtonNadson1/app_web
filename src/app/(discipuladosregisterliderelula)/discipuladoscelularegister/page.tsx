/* eslint-disable camelcase */
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import axios from "axios";
import HeaderCelulaDiscipulados from "./HeaderCelulaDiscipulados";
import { axiosAuthToken } from "@/lib/axios";
import ListMembersCelulaDiscipulado from "../components/listMembersCelulaDiscipulado";
import { auth } from "@/auth";

export default async function DiscipuladosCelula() {
  const session = await auth();
  const token = session?.user?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const celulaId = session?.user?.celulaId;
  // const URLCelula = `https://backibb-production.up.railway.app/celulas/${celulaId}`
  // const URLCelula = `https://app-ibb.onrender.com/celulas/${celulaId}`;
  const URLCelula = `https://back-ibb.vercel.app/celulas/${celulaId}`;
  console.log("celulaId", celulaId);
  console.log("URLCelula", URLCelula);

  const CelulaData = async () => {
    try {
      const { data } = await axiosAuthToken.get(URLCelula, config);
      console.log("data", data);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const celula = await CelulaData();
  console.log("celula", celula);

  return (
    <>
      <div className="relative w-full px-1 py-2 mx-auto">
        <div className="relative w-full mx-auto">
          <HeaderCelulaDiscipulados headerCelula={celula?.nome} />
        </div>
        <div className="relative flex flex-col w-full gap-3 px-1 mx-auto mt-3 mb-4">
          {celula && <ListMembersCelulaDiscipulado data={celula} />}
        </div>
      </div>
    </>
  );
}

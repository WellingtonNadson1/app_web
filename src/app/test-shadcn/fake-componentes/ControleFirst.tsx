"use client";
import { RegisterPresenceFormFirst } from "@/app/(celula)/celula/_components/ControlePresenceFirst/registerpresence";
import { CelulaProps, Meeting } from "@/app/(celula)/celula/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { useUserDataStore } from "@/store/UserDataStore";
import { User } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isSameDay, parseISO, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type member = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

const dataHoje = new Date();
const today = startOfToday();
const firstDayOfMonth = new Date(
  dataHoje.getFullYear(),
  dataHoje.getMonth(),
  1,
);
const lastDayOfMonth = new Date(
  dataHoje.getFullYear(),
  dataHoje.getMonth() + 1,
  0,
);
const URLCultosInd = `${BASE_URL}/cultosindividuais/perperiodo`;

export default function ControleFirst() {
  const { data: session } = useSession();

  const celulaId = session?.user.celulaId;
  const { token } = useUserDataStore.getState();

  const axiosAuth = useAxiosAuthToken(token);
  const URLCelula = `${BASE_URL}/celulas/${celulaId}`;

  const CelulaData = async () => {
    try {
      const result = await axiosAuth.get(URLCelula);
      return await result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const { data: celula } = useQuery<CelulaProps>({
    queryKey: ["celula", celulaId],
    queryFn: CelulaData,
    enabled: !!celulaId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (!celula) {
    return;
  }

  const celulaSort = celula?.membros.sort((a, b) =>
    a.first_name.localeCompare(b.first_name),
  );

  const MeetingsData = async () => {
    try {
      const { data } = await axiosAuth.post(URLCultosInd, {
        firstDayOfMonth,
        lastDayOfMonth,
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const { data } = useQuery<Meeting>({
    queryKey: ["meetingsData"],
    queryFn: MeetingsData,
    refetchOnWindowFocus: false,
  });

  const selectedDayMeetings = data?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  );

  return (
    <>
      {false ? (
        <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
          Presença já cadastrada!
        </p>
      ) : (
        <>
          {selectedDayMeetings && selectedDayMeetings?.length > 0 && (
            <>
              <ToastContainer />
              <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
                <div className="w-full px-2 py-2">
                  <div className="w-full px-1 py-2 rounded-md">
                    <h2 className="mb-6 text-base font-medium leading-8 text-gray-800">
                      Presença de Culto
                    </h2>
                    <div className="w-full border-separate border-spacing-y-6">
                      <div className="grid sm:grid-cols-5 grid-cols-3 items-center justify-between">
                        <div className="w-full py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                          Nome
                        </div>
                        <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                          Status
                        </div>
                        <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
                          Cargo
                        </div>
                        <div className="sm:grid col-span-2 w-full grid grid-cols-2 items-center justify-around">
                          <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-green-300">
                            P
                          </div>
                          <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-red-300">
                            F
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 text-sm font-normal text-gray-700">
                        {celulaSort?.map((user, index) => (
                          <form key={user.id} id={user.id}>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 items-center justify-between">
                              {/* Nome */}
                              <div className="sm:grid col-span-1">
                                <div className="flex items-center justify-start w-full gap-1 my-2 mr-2 sm:gap-3">
                                  <div className="p-1 border rounded-full bg-slate-50 border-[#1F70B6]">
                                    <User size={20} />
                                  </div>
                                  <h2 className="ml-4">{user.first_name}</h2>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="sm:grid col-span-1 hidden w-full text-center">
                                <span
                                  className={`hidden w-full rounded-md px-2 py-1 text-center sm:block ${"border border-red-200 bg-red-100 ring-red-500"}`}
                                >
                                  {"Normal"}
                                </span>
                              </div>

                              {/* Cargo */}
                              <div className="hidden w-full text-center sm:grid col-span-1">
                                <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline">
                                  {"Normal"}
                                </span>
                              </div>

                              {/* Presenca */}
                              <RadioGroup className="col-span-2 w-full grid grid-cols-2 items-center justify-around gap-3">
                                <RadioGroupItem
                                  className={`col-span-1 w-5 h-5 mx-auto text-green-800 text-base border-green-400 cursor-pointer aria-checked:bg-green-100 aria-checked:ring-2 aria-checked:ring-green-400/[.55]
                                                         `}
                                  value="true"
                                  id={`presence-${user.id}`}
                                />
                                <RadioGroupItem
                                  className={`col-span-1 w-5 h-5 mx-auto text-black text-base border-red-400 cursor-pointer aria-checked:bg-red-100 aria-checked:ring-2 aria-checked:ring-red-400/[.55]
                                                                                      `}
                                  value="false"
                                  id={`absence-${user.first_name}`}
                                />
                              </RadioGroup>
                            </div>
                            <RegisterPresenceFormFirst
                              id={selectedDayMeetings[0].id}
                              key={selectedDayMeetings[0].id}
                              culto={selectedDayMeetings[0].id}
                              celula={celula}
                            />
                          </form>
                        ))}
                        {false ? (
                          <button
                            type="submit"
                            className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-white animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Registrando...</span>
                          </button>
                        ) : (
                          <button
                            className="mx-auto mt-3 w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                            type="submit"
                          >
                            Registrar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

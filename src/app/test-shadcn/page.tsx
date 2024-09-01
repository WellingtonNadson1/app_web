/* eslint-disable camelcase */
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { useUserDataStore } from "@/store/UserDataStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isSameDay, parseISO, startOfToday } from "date-fns";
import { useSession } from "next-auth/react";
import { RegisterPresenceFormFirst } from "../(celula)/celula/_components/ControlePresenceFirst/registerpresence";
import { CelulaProps, Meeting } from "../(celula)/celula/schema";

export default function ControleCelulaSupervision() {
  const { data: session } = useSession();

  const celulaId = session?.user.celulaId;
  const { token } = useUserDataStore.getState();

  const axiosAuth = useAxiosAuthToken(token);

  const URLCultosInd = `${BASE_URL}/cultosindividuais/perperiodo`;
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

  const dataHoje = new Date();
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

  const { data, isSuccess } = useQuery<Meeting>({
    queryKey: ["meetingsData"],
    queryFn: MeetingsData,
    refetchOnWindowFocus: false,
  });

  if (isSuccess) {
    console.log("data", data);
  }

  const today = startOfToday();

  const selectedDayMeetings = data?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  );

  return (
    <>
      {selectedDayMeetings && selectedDayMeetings?.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              {selectedDayMeetings && selectedDayMeetings?.length > 0 && (
                <RegisterPresenceFormFirst
                  id={selectedDayMeetings[0].id}
                  key={selectedDayMeetings[0].id}
                  culto={selectedDayMeetings[0].id}
                  celula={celula!}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}

'use client'
import { BASE_URL, BASE_URL_LOCAL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { BookBookmark, Church, Cross, Student } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isSunday,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import pt from 'date-fns/locale/pt'
import { useState } from 'react'
import { z } from 'zod'
import SpinnerButton from './spinners/SpinnerButton'
import { Meeting } from '@/app/(celula)/celula/schema'
import { useUserDataStore } from '@/store/UserDataStore'

const meetingSchema = z.object({
  id: z.string(),
  culto_semana: z.object({
    nome: z.string(),
  }),
  imageUrl: z.string(),
  data_inicio_culto: z.string(),
  data_termino_culto: z.string(),
})

export type meetingsch = z.infer<typeof meetingSchema>

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CalendarLiderCelula() {
  const today = startOfToday()
  const URLCultosInd = `${BASE_URL_LOCAL}/cultosindividuais/perperiodo`
  const { token } = useUserDataStore.getState().state

  const axiosAuth = useAxiosAuthToken(token)

  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))

  if (!token) {
    return <SpinnerButton message={''} />
  }

  const dataHoje = new Date()
  const firstDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth(), 1);
  const lastDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth() + 1, 0);

  const { data, isLoading } = useQuery<Meeting>({
    queryKey: ['meetingsData'],
    queryFn: async () => {
      const { data } = await axiosAuth.post(URLCultosInd, {
        firstDayOfMonth,
        lastDayOfMonth
      })
      return data
    },
  })

  if (isLoading) {
    return <SpinnerButton message={''} />
  }
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  const selectedDayMeetings = data?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), selectedDay),
  )

  return (
    <div className="pt-4">
      <div className="px-2 py-6 bg-white rounded-lg shadow-md">
        <div className="max-w-md px-4 mx-auto sm:px-4 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-10">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-gray-900">
                  {format(firstDayCurrentMonth, 'MMMM yyyy', { locale: pt })}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 text-xs leading-6 text-center text-gray-500 mt-9">
                <div>D</div>
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      (dayIdx === 0 && colStartClasses[getDay(day)]) || '',
                      'py-1',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) ? 'text-white' : '',
                        !isEqual(day, selectedDay) && isToday(day)
                          ? 'text-red-500'
                          : '',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth)
                          ? 'text-gray-900'
                          : '',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth)
                          ? 'text-gray-400'
                          : '',
                        isEqual(day, selectedDay) && isToday(day)
                          ? 'bg-red-500'
                          : '',
                        isEqual(day, selectedDay) && !isToday(day)
                          ? 'bg-gray-900'
                          : '',
                        !isEqual(day, selectedDay) ? 'hover:bg-gray-200' : '',
                        isEqual(day, selectedDay) || isToday(day)
                          ? 'font-semibold'
                          : '',
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                      )}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>
                    {/* Pontos de Eventos */}
                    <div className="flex items-center justify-center gap-1 mx-auto">
                      {data &&
                        data?.some((meeting) =>
                          isSameDay(parseISO(meeting.data_inicio_culto), day),
                        ) && (
                          <div className="w-1 h-1 mt-1">
                            <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                          </div>
                        )}
                      {isSunday(day) ? (
                        <div className="w-1 h-1 mt-1">
                          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Section for the Events Day */}
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                Agenda para{' '}
                <time
                  dateTime={format(selectedDay, 'yyyy-MM-dd', { locale: pt })}
                >
                  {format(selectedDay, 'PP', { locale: pt })}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayMeetings && selectedDayMeetings?.length > 0 ? (
                  selectedDayMeetings?.map((meeting) => (
                    <MeetingComponent meeting={meeting} key={meeting.id} />
                  ))
                ) : (
                  <p>Sem Eventos hoje.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function MeetingComponent({ meeting }: { meeting: meetingsch }) {
  // eslint-disable-next-line camelcase
  const data_inicio_culto = parseISO(meeting?.data_inicio_culto)
  // eslint-disable-next-line camelcase
  const data_termino_culto = parseISO(meeting?.data_termino_culto)

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {meeting?.culto_semana?.nome === 'Domingo de Sacrifício' ? (
        <Cross
          width={10}
          height={10}
          weight="thin"
          className="flex-none w-10 h-10 rounded-full"
        />
      ) : meeting?.culto_semana?.nome === 'Culto de Edificação' ? (
        <BookBookmark
          width={10}
          height={10}
          weight="thin"
          className="flex-none w-10 h-10 rounded-full"
        />
      ) : meeting?.culto_semana?.nome === 'Capacitação Para Discípulos' ? (
        <Student
          width={10}
          height={10}
          weight="thin"
          className="flex-none w-10 h-10 rounded-full"
        />
      ) : (
        <Church
          width={10}
          height={10}
          weight="thin"
          className="flex-none w-10 h-10 rounded-full"
        />
      )}

      <div className="flex-auto">
        <p className="text-gray-900">{meeting?.culto_semana?.nome}</p>
        <p className="mt-0.5">
          <time dateTime={meeting?.data_inicio_culto}>
            {format(data_inicio_culto, 'H:mm', { locale: pt })}h
          </time>{' '}
          -{' '}
          <time dateTime={meeting?.data_termino_culto}>
            {format(data_termino_culto, 'H:mm', { locale: pt })}h
          </time>
        </p>
      </div>
    </li>
  )
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

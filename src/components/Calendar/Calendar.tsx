'use client'
import { fetchWithToken } from '@/functions/functions'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { BookBookmark, Church, Cross, Student } from '@phosphor-icons/react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  // isSaturday,
  // isSunday,
  isToday,
  // isWednesday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import pt from 'date-fns/locale/pt'
import { useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'
import useSWR from 'swr'
import DeleteCulto from './DeleteCulto'
import UpdateCulto from './UpdateCulto'

export type meeting = {
  id: string
  culto_semana: {
    nome: string
  }
  imageUrl: string
  data_inicio_culto: string
  data_termino_culto: string
}

const hostname = 'app-ibb.onrender.com'
const URLCultosInd = `https://${hostname}/cultosindividuais`

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// const handleDeleteClick = (
//   meetingId: string,
//   meetingCultoSemanaNome: string,
// ) => {
//   return <DeleteCulto culto={meetingId} cultoName={meetingCultoSemanaNome} />
// }

export default function Example() {
  const { data: session } = useSession()

  // UseSWR para buscar os dados combinados
  const { data: meetings } = useSWR<meeting[]>(
    [URLCultosInd, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
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

  const selectedDayMeetings = meetings?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), selectedDay),
  )

  return (
    <div className="pt-4">
      <div className="rounded-lg bg-white px-2 py-6 shadow-md">
        <div className="mx-auto max-w-md px-4 sm:px-4 md:max-w-4xl md:px-6">
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
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-9 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                <div>D</div>
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="mt-2 grid grid-cols-7 text-sm">
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
                    <div className="mx-auto flex items-center justify-center gap-1">
                      {meetings &&
                        meetings?.some((meeting) =>
                          isSameDay(parseISO(meeting.data_inicio_culto), day),
                        ) && (
                          <div className="mt-1 h-1 w-1">
                            <div className="h-1 w-1 rounded-full bg-sky-500"></div>
                          </div>
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
                    <Meeting meeting={meeting} key={meeting.id} />
                  ))
                ) : (
                  <p>Não há culto hoje.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meeting({ meeting }: { meeting: meeting }) {
  // eslint-disable-next-line camelcase
  const data_inicio_culto = parseISO(meeting.data_inicio_culto)
  // eslint-disable-next-line camelcase
  const data_termino_culto = parseISO(meeting.data_termino_culto)

  return (
    <li className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100">
      {meeting.culto_semana.nome === 'Domingo de Sacrifício' ? (
        <Cross
          width={10}
          height={10}
          weight="thin"
          className="h-10 w-10 flex-none rounded-full"
        />
      ) : meeting.culto_semana.nome === 'Culto de Edificação' ? (
        <BookBookmark
          width={10}
          height={10}
          weight="thin"
          className="h-10 w-10 flex-none rounded-full"
        />
      ) : meeting.culto_semana.nome === 'Capacitação Para Discípulos' ? (
        <Student
          width={10}
          height={10}
          weight="thin"
          className="h-10 w-10 flex-none rounded-full"
        />
      ) : (
        <Church
          width={10}
          height={10}
          weight="thin"
          className="h-10 w-10 flex-none rounded-full"
        />
      )}

      <div className="flex-auto">
        <p className="text-gray-900">{meeting.culto_semana.nome}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.data_inicio_culto}>
            {format(data_inicio_culto, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.data_termino_culto}>
            {format(data_termino_culto, 'h:mm a')}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                <UpdateCulto
                  cultoId={meeting.id}
                  // cultoName={meeting.culto_semana.nome}
                />
              </Menu.Item>
              <Menu.Item>
                <DeleteCulto
                  culto={meeting.id}
                  cultoName={meeting.culto_semana.nome}
                />
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  )
}

// function EditInactiveIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 13V16H7L16 7L13 4L4 13Z"
//         fill="#67e9a3ec"
//         stroke="#47c180f7"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function EditActiveIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M4 13V16H7L16 7L13 4L4 13Z"
//         fill="#47c180f7"
//         stroke="#87ffbfe6"
//         strokeWidth="2"
//       />
//     </svg>
//   )
// }

// function DeleteActiveIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="6"
//         width="10"
//         height="10"
//         fill="#ffb9b4dc"
//         stroke="#ffb9b4"
//         strokeWidth="2"
//       />
//       <path d="M3 6H17" stroke="#ffb9b4" strokeWidth="2" />
//       <path d="M8 6V4H12V6" stroke="#ffb9b4" strokeWidth="2" />
//     </svg>
//   )
// }

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

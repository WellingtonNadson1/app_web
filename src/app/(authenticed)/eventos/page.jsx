'use client'
import Calendar from '@/components/Calendar'

export default function Eventos() {
  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
      </div>
    </div>
  )
}

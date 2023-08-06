'use client'
import Calendar from '@/components/Calendar'
import ControlePresenca from '@/components/ControlePresenca'
import LicoesCelula from '@/components/LicoesCelula'

export default function ControleCelula() {
  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <ControlePresenca />
      </div>
    </div>
  )
}

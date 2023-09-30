import StatsCardRelatorios from '@/components/StatsCardRelatorios'
import MokupFrequenciaCulto from './mokupFrequenciaCulto'

export default function Relatorios() {
  return (
    <div className="mx-auto w-full px-2 py-2">
      <div className="mx-auto w-full"></div>
      <StatsCardRelatorios />
      <div className='mt-10 w-full px-2 py-2 mx-auto'>
        <MokupFrequenciaCulto />
      </div>
    </div>
  )
}

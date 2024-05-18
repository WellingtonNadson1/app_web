import { cn } from '@/lib/utils'
import React, { Fragment } from 'react'
import { TCelula, TSupervisionData } from './schema';
import { CorSupervision, ListSupervisores } from '@/contexts/ListSupervisores';
import dayjs from 'dayjs';

interface ITableRelatorioProsp {
  supervisionData: TSupervisionData
  celula: TCelula
}

const TabelRelatorio: React.FC<ITableRelatorioProsp> = ({ celula, supervisionData }) => {
  const corSupervisao = supervisionData.supervisionData.nome
  const newCorSupervisao = CorSupervision(corSupervisao)
  const Supervisor = ListSupervisores(corSupervisao)

  return (
    <div className='pt-3'>
      <div className={cn(`bg-yellow-400 w-full text-center text-white`, `${newCorSupervisao}`)}>
        <div className='pt-2 pb-0'>
          <h1 className='py-1 font-bold uppercase'>RELATÓRIO - SUPERVISÃO - {corSupervisao}</h1>
        </div>
        {
          corSupervisao ? (
            <div className='pb-2 pl-2'>
              <p className='p-2 text-base font-medium uppercase text-start'>SUPERVISOR(ES): <span className='font-normal'>{Supervisor}</span></p>
            </div>
          ) : (
            <div className='pb-2 pl-2'>
              <p className='p-2 text-base font-medium uppercase text-start'>SUPERVISOR(ES): <span className='font-normal '>Sem Dados</span></p>
            </div>
          )
        }
      </div>
      <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
        {/* Cabeçalho da tabela */}
        <thead className={cn(`p-2 text-center`, `${newCorSupervisao}`)}>
          <Fragment>
            <tr className={`mx-4 p-2`}>
              <th>
                <h1 className='p-2 font-bold text-center text-white uppercase'>CÉLULAS</h1>
              </th>
              <th>
                <h1 className='p-2 font-bold text-center text-white uppercase'>MEMBROS</h1>
              </th>

              {
                celula.reunioes_celula.map((dataCelula, dataCelulaIndex) => (
                  <th className='flex-col items-center justify-center w-20 h-20 p-2 mb-2 text-white' key={dataCelulaIndex}>
                    <div className=''>
                      <p>{`${dayjs(dataCelula.data_reuniao).format('ddd').toUpperCase()}`}</p>
                      <p>{`${dayjs(dataCelula.data_reuniao).format('DD/MM')}`}</p>
                    </div>
                  </th>
                ))
              }
            </tr>
          </Fragment>
        </thead>
        <tbody>

          <tr className={`border-b border-slate-600`}>
            {/* Coluna fixa */}
            <td className='px-4 bg-gray-50'>
              <p className='text-base font-medium text-black'>{celula.nome}</p>
              <p className='text-sm font-medium text-slate-600'>
                Líder: <span className='font-normal'>{celula?.lider?.first_name}</span>
              </p>
              <p className='text-sm text-slate-600'>
                Membros: <span>{celula._count.membros}</span>
              </p>
            </td>
            {/* Coluna para membros */}
            <td className='px-4'>
              {celula?.reunioes_celula[0]?.presencas_membros_reuniao_celula?.map((member) => (
                <tr className='w-20 h-20 py-4' key={member.membro.id}>
                  <div className='flex flex-col justify-center h-20'>
                    {member.membro.first_name}
                  </div>
                </tr>
              ))}
            </td>
            {/* Colunas dinâmicas para presenças */}
            {celula.reunioes_celula.map((cultoId, indexCulto) => (
              <td className='mx-4 mb-4 text-center border border-zinc-200' key={cultoId.id + indexCulto}>
                {cultoId?.presencas_membros_reuniao_celula?.map((member, indexMember) => {
                  return (
                    <div className='flex flex-col justify-center w-20 h-20 font-bold border-b border-zinc-200' key={cultoId.id + indexMember}>
                      {member ? (
                        <Fragment>
                          {member.status === true && (
                            <p className='text-green-600'>P</p>
                          )}
                          {member.status === false && (
                            <p className='text-red-600'>F</p>
                          )}
                        </Fragment>
                      ) : (
                        <p key={indexMember}>
                          <p className='font-normal text-slate-600'>-</p>
                        </p>
                      )}
                    </div>
                  );
                })}
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  )
}

export default TabelRelatorio

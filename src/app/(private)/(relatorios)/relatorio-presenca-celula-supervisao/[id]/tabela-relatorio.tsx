import type React from 'react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { CorSupervision, ListSupervisores } from '@/contexts/ListSupervisores';
import type { TCelula, TSupervisionData } from './schema';

interface ITabelRelatorioProps {
  supervisionData: TSupervisionData;
  celula: TCelula;
}

const TabelRelatorio: React.FC<ITabelRelatorioProps> = ({
  celula,
  supervisionData,
}) => {
  const corSupervisao = supervisionData.supervisionData.nome;
  const newCorSupervisao = CorSupervision(corSupervisao);
  const Supervisor = ListSupervisores(corSupervisao);

  const meetingSortedByDate = [...celula.reunioes_celula].sort(
    (a, b) =>
      new Date(a.data_reuniao).getTime() - new Date(b.data_reuniao).getTime(),
  );

  return (
    <div className="pt-3">
      <div
        className={cn(
          `bg-yellow-400 w-full text-center text-white`,
          newCorSupervisao,
        )}
      >
        <div className="pt-2 pb-0">
          <h1 className="py-1 font-bold uppercase">
            RELATÓRIO - SUPERVISÃO - {corSupervisao}
          </h1>
        </div>
        <div className="pb-2 pl-2">
          <p className="p-2 text-base font-medium uppercase text-start">
            SUPERVISOR(ES):{' '}
            <span className="font-normal">{Supervisor || 'Sem Dados'}</span>
          </p>
        </div>
      </div>
      <table className="border-b border-slate-600 text-sm text-left text-gray-500 auto-table dark:text-gray-400">
        <thead
          className={cn(`bg-yellow-400 p-2 text-center`, newCorSupervisao)}
        >
          <tr className="mx-4 p-2">
            <th>
              <h1 className="p-2 font-bold text-center text-white uppercase">
                CÉLULAS
              </h1>
            </th>
            <th>
              <h1 className="p-2 font-bold text-center text-white uppercase">
                MEMBROS
              </h1>
            </th>
            {meetingSortedByDate.length > 0 ? (
              meetingSortedByDate.map((dataCelula, dataCelulaIndex) => (
                <th
                  key={dataCelulaIndex}
                  className="flex-col items-center justify-center w-20 h-20 p-2 mb-2 text-white"
                >
                  <div>
                    <p>
                      {dayjs(dataCelula.data_reuniao)
                        .format('ddd')
                        .toUpperCase()}
                    </p>
                    <p>{dayjs(dataCelula.data_reuniao).format('DD/MM')}</p>
                  </div>
                </th>
              ))
            ) : (
              <th className="flex-col items-center justify-center h-20 p-2 mb-2 text-white">
                <div>
                  <p>Não Fez Registro</p>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 bg-gray-50">
              <p className="text-base font-medium text-black">{celula?.nome}</p>
              <p className="text-sm font-medium text-slate-600">
                Líder:{' '}
                <span className="font-normal">{celula?.lider?.first_name}</span>
              </p>
              <p className="text-sm text-slate-600">
                Membros: <span>{celula._count.membros}</span>
              </p>
            </td>
            {/* Coluna com Relacao dos memnbros */}
            <td className="">
              <tr className=" w-20 h-20">
                <div className="flex flex-col justify-center h-20"></div>
              </tr>
              {celula?.membros?.map((member) => (
                <tr className="w-20 h-20 py-4" key={member?.id}>
                  <div className="px-4 flex flex-col justify-center h-20">
                    {member?.first_name}
                  </div>
                </tr>
              ))}
            </td>
            {meetingSortedByDate.length > 0 ? (
              meetingSortedByDate.map((meeting, indexCulto) => (
                <td
                  key={meeting.id + indexCulto}
                  className="mx-4 mb-4 text-center border border-zinc-200"
                >
                  <div className="flex flex-col justify-center w-20 h-20 font-bold border-b border-zinc-200">
                    <div>Visita: {meeting.visitantes}</div>
                    <div>Almas: {meeting.almas_ganhas}</div>
                  </div>
                  {celula.membros.map((member) => {
                    const presenca =
                      meeting.presencas_membros_reuniao_celula.find(
                        (p) => p.membro?.id === member.id,
                      );
                    return (
                      <div
                        key={member.id}
                        className={cn(
                          'flex flex-col justify-center w-20 h-20 font-bold border-b border-zinc-200',
                          presenca?.status === true
                            ? 'bg-green-50'
                            : presenca?.status === false
                              ? 'bg-red-50'
                              : 'bg-zinc-50',
                        )}
                      >
                        {presenca ? (
                          presenca.status === true ? (
                            <p className="text-green-600">P</p>
                          ) : presenca.status === false ? (
                            <p className="text-red-600">F</p>
                          ) : (
                            <p className="text-yellow-600">-</p>
                          )
                        ) : (
                          <p className="text-yellow-600">-</p>
                        )}
                      </div>
                    );
                  })}
                </td>
              ))
            ) : (
              <td className="mx-4 mb-4 text-center border border-zinc-200">
                <div className="flex flex-col justify-center h-full font-bold">
                  <p className="px-2 text-yellow-600">
                    Não Fez Nenhum Lançamento
                  </p>
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelRelatorio;

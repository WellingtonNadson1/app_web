import React from 'react';
import { Pessoa } from "./[id]/schema";
import dayjs from 'dayjs';

interface RelatorioTableProps {
  data: Record<string, Pessoa[]>;
  idCultos: string[];
}

const RelatorioTable = ({ data, idCultos }: RelatorioTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome da Célula</th>
          <th>Membros</th>
          <th>Presenças nos Cultos</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([celulaNome, pessoas]) => (
          pessoas.map((member) => (
            <tr key={`${celulaNome}-${member.id}`}>
              <td>{celulaNome}</td>
              <td>{`${member.first_name}`}</td>
              <td key={`${celulaNome}-${member.id}-presencas`}>
                {idCultos.map((cultoId) => {
                  const presenceCulto = member.presencas_cultos.find(p => p.cultoIndividualId === cultoId);

                  return (
                    <td key={cultoId}>
                      {presenceCulto ? (
                        <>
                          <p className='mx-4 my-8 text-center text-black'>{`${dayjs(presenceCulto.date_create).format('ddd').toUpperCase()}`}</p>
                          {presenceCulto.status === true && (
                            <>
                              <p className='text-green-600'>{`${dayjs(presenceCulto.date_create).format('DD/MM')}`}</p>
                              <p className='text-green-600'>P</p>
                              <p>{member.first_name.slice(0, 10)}</p>
                            </>
                          )}
                          {presenceCulto.status === false && (
                            <>
                              <p className='text-red-600'>{`${dayjs(presenceCulto.date_create).format('DD/MM')}`}</p>
                              <p className='text-red-600'>F</p>
                              <p>{member.first_name.slice(0, 10)}</p>
                            </>
                          )}
                        </>
                      ) : (
                        <span>
                          <>
                            <p className='text-slate-600'>S.L</p>
                            <p className='text-slate-600'>N/A</p>
                            <p className='text-slate-600'>{`${dayjs().format('DD/MM')}`}</p>
                          </>
                        </span>
                      )}
                    </td>
                  );
                })}
              </td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  );
};

export default RelatorioTable;

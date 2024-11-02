export const memberCelula = [
  {
    first_name: 'Vida',
    situacao_no_reino: {
      nome: 'Ativos',
    },
    cargo_de_lideranca: {
      nome: 'Membro',
    },
    id: '1',
  },
  {
    first_name: 'Bo',
    situacao_no_reino: {
      nome: 'Ativos',
    },
    cargo_de_lideranca: {
      nome: 'Membro',
    },
    id: '2',
  },
  {
    first_name: 'Stephan',
    situacao_no_reino: {
      nome: 'Ativos',
    },
    cargo_de_lideranca: {
      nome: 'Membro',
    },
    id: '3',
  },
  {
    first_name: 'Nicholas',
    situacao_no_reino: {
      nome: 'Ativos',
    },
    cargo_de_lideranca: {
      nome: 'Membro',
    },
    id: '4',
  },
  {
    first_name: 'Keenan',
    situacao_no_reino: {
      nome: 'Ativos',
    },
    cargo_de_lideranca: {
      nome: 'Membro',
    },
    id: '5',
  },
]

export const fakeCelula = {
  id: 'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
  nome: 'Célula Esperança',
  lider: {
    first_name: 'João',
    id: 'l1a2b3c4',
  },
  supervisao: 'Supervisão Norte',
  cep: '12345-678',
  cidade: 'Cidade Exemplo',
  estado: 'EX',
  bairro: 'Bairro Exemplar',
  endereco: 'Rua das Flores',
  numero_casa: '123',
  date_inicio: '2022-01-01T19:00:00Z',
  date_que_ocorre: '2024-06-15T19:00:00Z',
  date_multipicar: '2023-12-31T19:00:00Z',
  supervisaoId: 's1a2b3c4',
  membros: [
    {
      id: 'm1a2b3c4',
      first_name: 'Maria',
      last_name: 'Silva',
      email: 'maria.silva@example.com',
    },
    {
      id: 'm5d6e7f8',
      first_name: 'José',
      last_name: 'Pereira',
      email: 'jose.pereira@example.com',
    },
  ],
  reunioes_celula: [
    {
      id: 'r1a2b3c4',
      status: 'Confirmada',
      celula: 'Célula Esperança',
      data_reuniao: '2024-06-01T19:00:00Z',
      presencas_reuniao_celula: [
        { user_id: 'm1a2b3c4', presente: true },
        { user_id: 'm5d6e7f8', presente: false },
      ],
    },
    {
      id: 'r5d6e7f8',
      status: 'Confirmada',
      celula: 'Célula Esperança',
      data_reuniao: '2024-06-08T19:00:00Z',
      presencas_reuniao_celula: [
        { user_id: 'm1a2b3c4', presente: true },
        { user_id: 'm5d6e7f8', presente: true },
      ],
    },
  ],
  userId: 'u1a2b3c4',
}

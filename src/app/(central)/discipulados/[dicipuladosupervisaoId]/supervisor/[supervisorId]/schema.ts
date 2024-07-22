export type dataUpdateDiscipulador = {
  id: string,
  discipuladorId: string
}

interface Membro {
  user_discipulos: {
    id: string;
    first_name: string;
  }
};

interface Supervisor {
  id: string;
  first_name: string;
  discipulos: {
    user_discipulos: {
      id: string;
      first_name: string;
    };
  }[];
}

export interface UpdateSupervisorProps {
  member: Membro;
  supervisor: Supervisor;
}

export type dataUpdateDiscipulador = {
  id: string,
  discipuladorId: string
}

interface Membro {
  user_discipulador_usuario_usuario_idTouser: {
    id: string;
    first_name: string;
  }
};

interface Supervisor {
  id: string;
  first_name: string;
  discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
    user_discipulador_usuario_usuario_idTouser: {
      id: string;
      first_name: string;
    };
  }[];
}

export interface UpdateSupervisorProps {
  member: Membro;
  supervisor: Supervisor;
}

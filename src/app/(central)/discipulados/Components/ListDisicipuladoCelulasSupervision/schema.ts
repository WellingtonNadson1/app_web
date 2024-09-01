export interface ICelula {
  id: string;
  nome: string;
  lider: {
    id: string;
    first_name: string;
  };
}

export interface ListCelulasProps {
  data: ICelula[];
}

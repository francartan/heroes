export interface IHeroeResponse {
  resultados: IHeroe[];
}

export interface IHeroe {
  id: number;
  nombre: string;
  raza: string;
  base: string;
  imagen: string;
}

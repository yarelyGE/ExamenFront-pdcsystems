export interface Movie {
  id: number;
  name: string;
  releaseYear: string; // DateTime en formato ISO
  gender: string;
  duration: string; // TimeSpan en formato HH:MM:SS
  fkDirector: number;
}

export interface MovieCreateRequest {
  name: string;
  releaseYear: string; // DateTime en formato ISO
  gender: string;
  duration: string; // TimeSpan en formato HH:MM:SS
  fkDirector: number;
}

export interface MovieUpdateRequest {
  id: number; // ¡IMPORTANTE! Tu API espera el ID en el objeto
  name: string;
  releaseYear: string; // DateTime en formato ISO
  gender: string;
  duration: string; // TimeSpan en formato HH:MM:SS
  fkDirector: number;
}

export interface Director {
  id: number;
  name: string;
  nationality: string;
  ager: number;
  active: boolean;
}

export interface DirectorCreateRequest {
  name: string;
  nationality: string;
  ager: number;
  active: boolean;
}

export interface DirectorUpdateRequest {
  id: number; // ¡IMPORTANTE! Tu API espera el ID en el objeto
  name: string;
  nationality: string;
  ager: number;
  active: boolean;
}

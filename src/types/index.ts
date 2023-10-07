// Define the types used in the application

export interface User {
  id?: string;
  uid: string;
  phoneNumber?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

export interface AppsheetResponse {
  result: "ok" | "error";
  resultDetail?: string;
  rowCount: number;
  rows: any[];
}

export interface AppsheetRequestBody {
  Action: string;
  Properties: {
    locale?: string;
    Selector?: string;
    RunAsUserEmail?: string;
  };
  Rows: any[];
}

// Define the types used in the Pinia store

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface Permiso {
  ID?: string;
  "FECHA Y HORA"?: string;
  "FECHA Y HORA SALIDA": string;
  "FECHA Y HORA LLEGADA"?: string;
  "TIPO SOLICITUD": string;
  COLABORADOR?: string;
  MOTIVO: string;
  OBSERVACIONES?: string;
  REMUNERADA?: string;
  ESTADO: string;
  ADJUNTOS?: string;
  "TIEMPO PERMISO": "";
}

export interface AppSheetBody {
  Action: string;
  Properties: {
    locale: string;
    Selector: string;
  };
  Rows: never[];
}

export interface AppSheetResponse {
  json: () => Promise<any>;
}

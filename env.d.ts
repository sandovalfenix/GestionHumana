/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPSHEET_API_KEY: string;
  readonly VITE_APPSHEET_API_HOST: string;
  readonly VITE_APPSHEET_API_APP_ID: string;

  readonly VITE_FIREBASE_apiKey: string;
  readonly VITE_FIREBASE_authDomain: string;
  readonly VITE_FIREBASE_projectId: string;
  readonly VITE_FIREBASE_storageBucket: string;
  readonly VITE_FIREBASE_messagingSenderId: string;
  readonly VITE_FIREBASE_appId: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

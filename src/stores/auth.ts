import { defineStore } from "pinia";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "@/types";
import { useColaboradoresStore } from "./colaboradores";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async checkUserAuth(): Promise<boolean> {
      try {
        return await new Promise((resolve, reject) => {
          onAuthStateChanged(
            auth,
            async (user) => {
              if (user) {
                this.setAuth(user.uid, user.phoneNumber);
                resolve(true);
              } else {
                resolve(false);
              }
            },
            (e) => {
              reject(e);
            }
          );
        });
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async signOut() {
      try {
        await auth.signOut();
        this.user = null;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async setAuth(uid: string | null, phoneNumber: string | null) {
      const colaboradoresStore = useColaboradoresStore();
      const colaborador = await colaboradoresStore.getColaborador(
        phoneNumber?.replace("+57", "")!,
        "TELEFONO"
      );

      const photoURL = colaborador?.FOTO
        ? `${
            import.meta.env.VITE_APPSHEET_MEDIA_URL
          }&tableName=Colaboradores&fileName=${encodeURIComponent(
            colaborador?.FOTO
          )}`
        : "https://cdn-icons-png.flaticon.com/512/9386/9386837.png";

      this.user =
        uid && phoneNumber
          ? {
              id: colaborador?.CEDULA,
              uid,
              phoneNumber,
              displayName: colaborador?.NOMBRES + " " + colaborador?.APELLIDOS,
              photoURL,
              email: colaborador["CORREO PERSONAL"],
            }
          : null;
    },
  },
});

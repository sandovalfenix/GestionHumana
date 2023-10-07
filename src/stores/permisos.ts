import { defineStore } from "pinia";
import { useAddRows, useGetData, useUpdateData } from "@/api/appsheet";
// interfaces
import type { Permiso } from "@/types";

export const usePermisosStore = defineStore({
  id: "permisos",
  state: () => ({
    permisos: Array<Permiso>(),
    loading: true,
    error: null,
  }),
  actions: {
    async getPermisos(value?: any, key?: string) {
      const selector = key ? `FILTER(PERMISOS, [${key}]=${value})` : "";
      const { data, loading } = await useGetData("Permisos", selector);
      this.permisos = data.value;
      this.loading = loading.value;
    },
    async getPermiso(value: any, key: string) {
      await this.getPermisos(value, key);
      return this.permisos[0];
    },
    async newPermiso(permiso: Permiso) {
      const { data, loading } = await useAddRows("Permisos", [
        permiso as never,
      ]);

      this.permisos.push(data.value[0]);
      this.loading = loading.value;
    },
    async addFilesURL(permisoID: string, filesURL: string[]) {
      let soportes = filesURL.map(
        (url, index) =>
          ({
            FORMATO: permisoID,
            NOMBRE: "Soporte_" + (index + 1),
            ARCHIVO: url,
          } as never)
      );
      const { loading } = await useAddRows("SOPORTES_PERMISOS", soportes);

      this.loading = loading.value;
    },
    async updatePermiso(permiso: Permiso) {
      const { data, loading } = await useUpdateData("Permisos", [
        permiso as never,
      ]);

      this.loading = loading.value;
    },
    async deletePermiso(permisoID: string) {
      const { loading } = await useUpdateData("Permisos", [
        {
          ID: permisoID,
          ESTADO: "Eliminado",
        } as never,
      ]);

      this.loading = loading.value;
    },
  },
});

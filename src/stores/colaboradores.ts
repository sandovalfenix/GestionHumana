import { defineStore } from "pinia";
import { useGetData } from "@/api/appsheet";

export const useColaboradoresStore = defineStore({
  id: "colaboradores",
  state: () => ({
    colaboradores: [] as any[],
    loading: true,
    error: null,
  }),
  actions: {
    async getColaboradores(value?: string, key?: string) {
      const selector = key ? `FILTER(Colaboradores, [${key}]=${value})` : "";
      const { data, loading } = await useGetData("Colaboradores", selector);

      this.colaboradores = data.value;
      this.loading = loading.value;
    },
    async getColaborador(value: string, key: string) {
      await this.getColaboradores(value, key);
      return this.colaboradores[0];
    },
  },
});

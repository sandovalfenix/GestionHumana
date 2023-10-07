import { ref } from "vue";
import type { AppSheetBody, AppSheetResponse } from "@/types";

const AppSheetFetch = async (
  tableName: string,
  action: string,
  rows?: Array<never>,
  selector?: string
) => {
  const data = ref([]);
  const loading = ref(true);

  const body: AppSheetBody = {
    Action: action,
    Properties: {
      locale: "es-ES",
      Selector: selector || "",
    },
    Rows: rows || [],
  };

  let appId = import.meta.env.VITE_APPSHEET_API_APP_ID;
  let hostApi = import.meta.env.VITE_APPSHEET_API_BASE_URL;

  try {
    const response: AppSheetResponse = await fetch(
      `${hostApi}/${appId}/tables/${tableName}/Action`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          applicationAccessKey: import.meta.env.VITE_APPSHEET_API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    data.value = await response.json();
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    loading.value = false;
  }

  return { data, loading };
};

export const useGetData = async (tableName: string, Selector?: string) => {
  return await AppSheetFetch(tableName, "Find", [], Selector);
};

export const useAddRows = (
  tableName: string,
  rows: Array<never>,
  selector?: string
) => {
  return AppSheetFetch(tableName, "Add", rows, selector);
};

export const useUpdateData = (tableName: string, rows: Array<never>) => {
  return AppSheetFetch(tableName, "Edit", rows);
};

export const useDeleteData = (tableName: string, rows: Array<never>) => {
  return AppSheetFetch(tableName, "Delete", rows);
};

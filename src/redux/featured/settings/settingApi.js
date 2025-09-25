import { api } from "@/redux/baseUrl/baseUrl";

const settingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/rule/terms-and-conditions`,
       
      }),
    }),
  }),
});

export const {
  useGetSettingQuery,
} = settingApi;

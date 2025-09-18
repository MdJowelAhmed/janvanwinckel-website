import { api } from "@/redux/baseUrl/baseUrl";

const breederApi = api.injectEndpoints({
    endpoints: (builder) => ({
   getBreeder: builder.query({
    query: (data) => {
        return {
          url: `/breeder`,
        method: "GET"
        };
      },
      invalidatesTags: ["Newsletter"],
   })

    }),
});

export const { useGetBreederQuery } = breederApi;


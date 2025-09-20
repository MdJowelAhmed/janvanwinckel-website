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
   }),
   getAllSiblings: builder.query({
    query: (id) => {
        return {
          url: `/pigeon/siblings/${id}`,
        method: "GET"
        };
      },
      invalidatesTags: ["Newsletter"],
   })

    }),
});

export const { useGetBreederQuery, useGetAllSiblingsQuery } = breederApi;


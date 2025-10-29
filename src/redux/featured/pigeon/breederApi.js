import { api } from "@/redux/baseUrl/baseUrl";

const breederApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBreeder: builder.query({
      query: (limit = 100) => ({
        url: `/breeder/verify?limit=${limit}`,
        method: "GET",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    getAllSiblings: builder.query({
      query: (id) => {
        return {
          url: `/pigeon/siblings/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Newsletter"],
    }),
    getAllPigeonName: builder.query({
      query: (id) => {
        return {
          url: "/pigeon/searchAllName",
          method: "GET",
        };
      },
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const { useGetBreederQuery, useGetAllSiblingsQuery, useGetAllPigeonNameQuery } = breederApi;

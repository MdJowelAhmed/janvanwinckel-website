import { api } from "@/redux/baseUrl/baseUrl";

const pigeonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPigeonPackages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            if (
              arg.value !== "" &&
              arg.value !== null &&
              arg.value !== undefined
            ) {
              params.append(arg.name, arg.value);
            }
          });
        }
        return {
          method: "GET",
          url: `/pigeon?${params.toString()}`,
        };
      },
      providesTags: ["Pigeon"],
    }),
    getMyPigeonPackages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            if (
              arg.value !== "" &&
              arg.value !== null &&
              arg.value !== undefined
            ) {
              params.append(arg.name, arg.value);
            }
          });
        }
        return {
          method: "GET",
          url: `/pigeon/myAllpigeons?${params.toString()}`,
        };
      },
      providesTags: ["Pigeon"],
    }),

    // Fix for your pigeonApi.js
    getPigeonSearch: builder.query({
      query: (searchTerm) => {
        // Directly use the searchTerm as query parameter
        return {
          url: `/pigeon/search?searchTerm=${encodeURIComponent(searchTerm)}`,
          method: "GET",
        };
      },
      providesTags: ["Pigeon"],
    }),
    getAllPigeonSearch: builder.query({
      query: (searchTerm) => {
        // Directly use the searchTerm as query parameter
        return {
          url: `/pigeon/searchAll?searchTerm=${encodeURIComponent(searchTerm)}`,
          method: "GET",
        };
      },
      providesTags: ["Pigeon"],
    }),

    getSinglePigeon: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/pigeon/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Pigeon", id }],
    }),
    getPigeonPedigreeChartData: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/pigeon/family/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Pigeon", id }],
    }),

    createPigeon: builder.mutation({
      query: (formData) => {
        return {
          method: "POST",
          url: `/pigeon`,
          body: formData,
        };
      },
      invalidatesTags: ["Pigeon"],
    }),

    updatePigeon: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/pigeon/${id}`,
          body: data,
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg instanceof FormData ? arg.get("_id") : arg._id;
        return [{ type: "Pigeon", id }, "Pigeon"];
      },
    }),

    deletePigeon: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/pigeon/${id}`,
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "Pigeon", id },
        "Pigeon",
      ],
    }),

    // Additional endpoints for enhanced functionality
    searchPigeons: builder.query({
      query: (searchTerm) => {
        return {
          method: "GET",
          url: `/pigeon/search?q=${encodeURIComponent(searchTerm)}`,
        };
      },
      providesTags: ["Pigeon"],
    }),

    getPigeonsByStatus: builder.query({
      query: (status) => {
        return {
          method: "GET",
          url: `/pigeon/status/${status}`,
        };
      },
      providesTags: ["Pigeon"],
    }),

    getPigeonStats: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/pigeon/stats`,
        };
      },
      providesTags: ["PigeonStats"],
    }),

    bulkUpdatePigeons: builder.mutation({
      query: (data) => {
        return {
          method: "PUT",
          url: `/pigeon/bulk`,
          data: data,
        };
      },
      invalidatesTags: ["Pigeon"],
    }),

    exportPigeons: builder.query({
      query: (format = "pdf") => {
        return {
          method: "GET",
          url: `/pigeon/export?format=${format}`,
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    importPigeons: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: `/pigeon/import`,
          data: data,
        };
      },
      invalidatesTags: ["Pigeon"],
    }),
    
    pigeonAddMyLoftOverview: builder.mutation({
      query: (body) => ({
        url: "/pigeon/add",
        method: "POST",
        body, 
      }),
      invalidatesTags: ["Pigeon"],
    }),
  }),
});

export const {
  useGetPigeonPackagesQuery,
  useGetMyPigeonPackagesQuery,
  useGetPigeonSearchQuery,
  useGetAllPigeonSearchQuery,
  useGetSinglePigeonQuery,
  useCreatePigeonMutation,
  useUpdatePigeonMutation,
  useDeletePigeonMutation,
  useSearchPigeonsQuery,
  useGetPigeonsByStatusQuery,
  useGetPigeonStatsQuery,
  useBulkUpdatePigeonsMutation,
  useExportPigeonsQuery,
  useImportPigeonsMutation,
  useGetPigeonPedigreeChartDataQuery,
  // Lazy queries
  useLazySearchPigeonsQuery,
  useLazyExportPigeonsQuery,
  usePigeonAddMyLoftOverviewMutation,
} = pigeonApi;

export default pigeonApi;

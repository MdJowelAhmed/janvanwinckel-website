import { api } from "@/redux/baseUrl/baseUrl";

const newsletterApi = api.injectEndpoints({
    endpoints: (builder) => ({
   createNewsletter: builder.mutation({
    query: (data) => {
        return {
          url: `/user-subscription`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Newsletter"],
   })

    }),
});

export const { useCreateNewsletterMutation } = newsletterApi;


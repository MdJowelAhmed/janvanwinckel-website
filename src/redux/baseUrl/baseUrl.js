import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://50.6.200.33:5001/api/v1",
    baseUrl: "http://206.162.244.155:5001/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Posts", "Comments", "Likes","Community", "Package", "Subscription", "Access", "Pigeon","Notification","Contact"], 





  endpoints: () => ({}),
});




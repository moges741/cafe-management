import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Single base query config for the entire app
// credentials: 'include' is CRITICAL — this is what makes the browser
// send the HttpOnly cookies (access_token, refresh_token) with every request
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  // tagTypes lets different endpoints invalidate each other's cache
  // e.g. after creating an order, the "Orders" list refetches automatically
  tagTypes: ['User', 'Product', 'Category', 'Order', 'Payment', 'Inventory', 'Branch', 'Cart'],
  endpoints: () => ({}),
})
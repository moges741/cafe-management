import { baseApi } from '@/lib/api'

interface User {
  id:    string
  email: string
  role:  { id: string; name: string }
}

interface LoginRequest {
  email:    string
  password: string
}

interface RegisterRequest {
  email:    string
  password: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation = anything that changes server state (POST/PATCH/DELETE)
    // Query = anything that reads data (GET)
    login: builder.mutation<{ message: string }, LoginRequest>({
      query: (body) => ({
        url:    '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url:    '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url:    '/auth/logout',
        method: 'POST',
      }),
    }),

    // We don't have a dedicated "who am I" endpoint yet on the backend —
    // this calls the users/me pattern. If your backend doesn't have this,
    // flag it and we'll add a lightweight GET /auth/me endpoint
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi
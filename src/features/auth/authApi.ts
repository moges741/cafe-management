// import { baseApi } from '@/lib/api'

// interface User {
//   id:    string
//   email: string
//   role:  { id: string; name: string }
// }

// interface LoginRequest {
//   email:    string
//   password: string
// }

// interface RegisterRequest {
//   firstName: string
//   lastName:  string
//   email:     string
//   password:  string
// }

// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<{ message: string }, LoginRequest>({
//       query: (body) => ({
//         url:    '/auth/login',
//         method: 'POST',
//         body,
//       }),
//     }),

//     register: builder.mutation<{ message: string }, RegisterRequest>({
//       query: (body) => ({
//         url:    '/auth/register',
//         method: 'POST',
//         body,
//       }),
//     }),

//     verifyEmail: builder.mutation<{ message: string }, { token: string }>({
//       query: (body) => ({
//         url:    '/auth/verify-email',
//         method: 'POST',
//         body,
//       }),
//     }),

//     forgotPassword: builder.mutation<{ message: string }, { email: string }>({
//       query: (body) => ({
//         url:    '/auth/forgot-password',
//         method: 'POST',
//         body,
//       }),
//     }),

//     resetPassword: builder.mutation<{ message: string }, any>({
//       query: (body) => ({
//         url:    '/auth/reset-password',
//         method: 'POST',
//         body,
//       }),
//     }),

//     logout: builder.mutation<{ message: string }, void>({
//       query: () => ({
//         url:    '/auth/logout',
//         method: 'POST',
//       }),
//     }),

//    getMe: builder.query<User, void>({
//      query: () => '/auth/me',
//      providesTags: ['User'],
//    }),
//   }),
// })

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useVerifyEmailMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
//   useLogoutMutation,
//   useGetMeQuery,
// } = authApi

import { baseApi } from '@/lib/api'
import type { User } from './authSlice'

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  email: string
  password: string
}


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ message: string }, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => ({
        ...response,
        user: {
          ...response.user,
          role: response.user?.role?.name || response.user?.role,
          branchId: response.user?.employee?.branchId,
        }
      }),
      invalidatesTags: ['Auth'],
    }),
   verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (body) => ({
      url:    '/auth/verify-email',    
      method: 'POST',
       body,
     }),
 }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url:    '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, any>({
      query: (body) => ({
        url:    '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<{ message: string }, RegisterDto>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: any) => ({
        ...response,
        role: response.role?.name || response.role,
        branchId: response.employee?.branchId,
      }),
      providesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
 useResetPasswordMutation,
 
} = authApi
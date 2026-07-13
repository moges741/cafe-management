import { baseApi } from '@/lib/api'

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStaff: builder.mutation<any, { email: string; password: string; role: string; branchId: string }>({
      query: (body) => ({ url: '/auth/staff', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useCreateStaffMutation } = staffApi
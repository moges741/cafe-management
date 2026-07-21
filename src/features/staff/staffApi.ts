import { baseApi } from '@/lib/api'

export interface StaffUser {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  role: {
    id: string
    name: string
  }
  createdAt: string
}

interface CreateStaffDto {
  email: string
  password: string
  role: string
  branchId: string
}

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<StaffUser[], { branchId?: string }>({
      query: (params) => ({
        url: '/auth/staff',
        params: params?.branchId ? { branchId: params.branchId } : undefined,
      }),
      providesTags: ['Staff'],
    }),

    createStaff: builder.mutation<StaffUser, CreateStaffDto>({
      query: (body) => ({
        url: '/auth/staff',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Staff'],
    }),

    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/auth/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),

    toggleStaffStatus: builder.mutation<StaffUser, string>({
      query: (id) => ({
        url: `/auth/staff/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
})

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useToggleStaffStatusMutation,
} = staffApi
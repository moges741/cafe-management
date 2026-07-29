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
  firstName: string
  lastName: string
  email: string
  password?: string
  role: string
  branchId: string
}

interface UpdateStaffDto {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  role?: string
  branchId?: string
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
    staffUser: builder.query<StaffUser, string>({
      query: (id) => ({
        url: `/auth/staff/${id}`,
      }),
      providesTags: ['Staff'],
    }),

    updateStaff: builder.mutation<StaffUser, { id: string; data: UpdateStaffDto }>({
      query: ({ id, data }) => ({
        url: `/auth/staff/${id}`,
        method: 'PATCH',
        body: data,
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
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useToggleStaffStatusMutation,
  useStaffUserQuery,
} = staffApi
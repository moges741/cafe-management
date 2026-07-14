import { baseApi } from '@/lib/api'

export interface Branch {
  id: string
  name: string
  address?: string | null
  timezone: string
  isActive: boolean
  createdAt: string
}

export interface CreateBranchRequest {
  name: string
  address?: string
  timezone?: string
}

export interface UpdateBranchRequest {
  id: string
  name?: string
  address?: string
  timezone?: string
  isActive?: boolean
}

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<Branch[], void>({
      query: () => '/branches',
      providesTags: ['Branch'],
    }),

    getBranchById: builder.query<Branch, string>({
      query: (id) => `/branches/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Branch', id }],
    }),

    createBranch: builder.mutation<Branch, CreateBranchRequest>({
      query: (body) => ({
        url: '/branches',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Branch'],
    }),

    updateBranch: builder.mutation<Branch, UpdateBranchRequest>({
      query: ({ id, ...body }) => ({
        url: `/branches/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Branch'],
    }),

    deactivateBranch: builder.mutation<void, string>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Branch'],
    }),
  }),
})

export const {
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeactivateBranchMutation,
} = branchesApi

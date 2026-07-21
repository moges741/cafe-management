import { baseApi } from '@/lib/api'

export interface Category {
  id:          string
  name:        string
  description: string | null
  imageUrl:    string | null
  isActive:    boolean
  _count?:     { products: number }
}

interface GetCategoriesParams {
  includeInactive?: boolean
  branchId?: string
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], GetCategoriesParams | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {}
        if (params?.includeInactive) queryParams.includeInactive = 'true'
        if (params?.branchId) queryParams.branchId = params.branchId
        return {
          url: '/categories',
          params: queryParams,
        }
      },
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, { name: string; description?: string; branchId: string }>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),

updateCategory: builder.mutation<Category, { id: string; data: { name: string; description?: string } }>({
  query: ({ id, data }) => ({ url: `/categories/${id}`, method: 'PATCH', body: data }),
  invalidatesTags: ['Category'],
}),

deleteCategory: builder.mutation<Category, string>({
  query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
  invalidatesTags: ['Category'],
}),

uploadCategoryImage: builder.mutation<Category, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({
    url:    `/categories/${id}/image`,
    method: 'PATCH',
    body:   formData,
  }),
  invalidatesTags: ['Category'],
}),
  }),
})

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useUploadCategoryImageMutation } = categoriesApi
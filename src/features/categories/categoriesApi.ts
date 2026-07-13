import { baseApi } from '@/lib/api'

export interface Category {
  id:          string
  name:        string
  description: string | null
  imageUrl:    string | null
  isActive:    boolean
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, { name: string; description?: string }>({
  query: (body) => ({ url: '/categories', method: 'POST', body }),
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

export const { useGetCategoriesQuery } = categoriesApi
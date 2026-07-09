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
  }),
})

export const { useGetCategoriesQuery } = categoriesApi
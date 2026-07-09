import { baseApi } from '@/lib/api'

export interface ProductImage {
  id:        string
  url:       string
  publicId:  string | null
  position:  number
}

export interface Product {
  id:          string
  name:        string
  description: string | null
  price:       string
  imageUrl:    string | null
  isAvailable: boolean
  categoryId:  string
  branchId:    string
  category:    { id: string; name: string }
  images?:     ProductImage[]
}

interface ProductsQueryParams {
  branchId?:    string
  categoryId?:  string
  isAvailable?: boolean
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductsQueryParams>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Product', id }],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi
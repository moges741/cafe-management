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
 createProduct: builder.mutation<Product, {
  name: string; description?: string; price: number; categoryId: string; branchId: string
}>({
  query: (body) => ({ url: '/products', method: 'POST', body }),
  invalidatesTags: ['Product'],
}),

updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
  query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PATCH', body: data }),
  invalidatesTags: ['Product'],
}),


uploadProductImages: builder.mutation<Product, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({ url: `/products/${id}/images`, method: 'POST', body: formData }),
  invalidatesTags: ['Product'],
}),


toggleProductAvailability: builder.mutation<Product, string>({
  query: (id) => ({ url: `/products/${id}/toggle-availability`, method: 'PATCH' }),
  invalidatesTags: ['Product'],
}),


  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery, useUpdateProductMutation, useToggleProductAvailabilityMutation, useCreateProductMutation, useUploadProductImagesMutation } = productsApi
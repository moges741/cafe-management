import { baseApi } from '@/lib/api';

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  sku?: string | null;
  unit: string;
  minStockLevel: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MainStoreItem {
  id: string;
  materialId: string;
  material: RawMaterial;
  branchId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface KitchenItem {
  id: string;
  materialId: string;
  material: RawMaterial;
  branchId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequestItem {
  id: string;
  requestId: string;
  materialId: string;
  material: RawMaterial;
  requestedQuantity: number;
  approvedQuantity?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequest {
  id: string;
  branchId: string;
  status: 'pending' | 'approved' | 'partially_approved' | 'rejected';
  notes?: string | null;
  requestedById: string;
  requestedBy: { id: string; email: string; firstName: string; lastName: string };
  approvedById?: string | null;
  approvedBy?: { id: string; email: string; firstName: string; lastName: string } | null;
  createdAt: string;
  updatedAt: string;
  items: MaterialRequestItem[];
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  materialId: string;
  material: RawMaterial;
  quantity: number;
}

export interface Recipe {
  id: string;
  productId: string;
  ingredients: RecipeIngredient[];
}

export interface InventoryTransaction {
  id: string;
  materialId: string;
  material: RawMaterial;
  branchId: string;
  quantity: number;
  source: string;
  destination: string;
  type: string;
  actorId?: string | null;
  actor?: { id: string; email: string; firstName: string; lastName: string } | null;
  notes?: string | null;
  createdAt: string;
}

export const inventoryWorkflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRawMaterials: builder.query<RawMaterial[], void>({
      query: () => '/inventory/raw-materials',
      providesTags: ['RawMaterial'],
    }),

    createRawMaterial: builder.mutation<RawMaterial, Partial<RawMaterial>>({
      query: (body) => ({
        url: '/inventory/raw-materials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RawMaterial'],
    }),

    updateRawMaterial: builder.mutation<RawMaterial, { id: string; body: Partial<RawMaterial> }>({
      query: ({ id, body }) => ({
        url: `/inventory/raw-materials/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['RawMaterial', 'MainStore', 'KitchenStock'],
    }),

    getMainStoreStock: builder.query<MainStoreItem[], { branchId: string }>({
      query: ({ branchId }) => ({
        url: '/inventory/main-store',
        params: { branchId },
      }),
      providesTags: ['MainStore'],
    }),

    adjustMainStore: builder.mutation<
      MainStoreItem,
      { branchId: string; materialId: string; delta: number; reason: string; note?: string }
    >({
      query: ({ branchId, materialId, ...body }) => ({
        url: `/inventory/main-store/${materialId}/adjust`,
        method: 'PATCH',
        params: { branchId },
        body,
      }),
      invalidatesTags: ['MainStore', 'InventoryTransaction'],
    }),

    takeFromMainStore: builder.mutation<
      KitchenItem,
      { branchId: string; materialId: string; quantity: number; notes?: string }
    >({
      query: ({ branchId, ...body }) => ({
        url: '/inventory/take-from-store',
        method: 'POST',
        params: { branchId },
        body,
      }),
      invalidatesTags: ['MainStore', 'KitchenStock', 'InventoryTransaction'],
    }),

    getKitchenStock: builder.query<KitchenItem[], { branchId: string }>({
      query: ({ branchId }) => ({
        url: '/inventory/kitchen',
        params: { branchId },
      }),
      providesTags: ['KitchenStock'],
    }),

    adjustKitchen: builder.mutation<
      KitchenItem,
      { branchId: string; materialId: string; delta: number; reason: string; note?: string }
    >({
      query: ({ branchId, materialId, ...body }) => ({
        url: `/inventory/kitchen/${materialId}/adjust`,
        method: 'PATCH',
        params: { branchId },
        body,
      }),
      invalidatesTags: ['KitchenStock', 'InventoryTransaction'],
    }),

    createMaterialRequest: builder.mutation<
      MaterialRequest,
      { branchId: string; items: { materialId: string; requestedQuantity: number }[]; notes?: string }
    >({
      query: (body) => ({
        url: '/inventory/requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MaterialRequest'],
    }),

    getMaterialRequests: builder.query<MaterialRequest[], { branchId?: string } | void>({
      query: (params) => ({
        url: '/inventory/requests',
        params: params || undefined,
      }),
      providesTags: ['MaterialRequest'],
    }),

    getMaterialRequestById: builder.query<MaterialRequest, string>({
      query: (id) => `/inventory/requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'MaterialRequest', id }],
    }),

    reviewMaterialRequest: builder.mutation<
      MaterialRequest,
      {
        id: string;
        body: {
          status: 'approved' | 'partially_approved' | 'rejected';
          items?: { materialId: string; approvedQuantity: number }[];
          notes?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/inventory/requests/${id}/review`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['MaterialRequest', 'MainStore', 'KitchenStock', 'InventoryTransaction'],
    }),

    createOrUpdateRecipe: builder.mutation<Recipe, { productId: string; ingredients: { materialId: string; quantity: number }[] }>({
      query: (body) => ({
        url: '/inventory/recipes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Recipe'],
    }),

    getRecipe: builder.query<Recipe, string>({
      query: (productId) => `/inventory/recipes/${productId}`,
      providesTags: (_res, _err, productId) => [{ type: 'Recipe', id: productId }],
    }),

    getTransactionHistory: builder.query<InventoryTransaction[], { branchId?: string } | void>({
      query: (params) => ({
        url: '/inventory/transactions',
        params: params || undefined,
      }),
      providesTags: ['InventoryTransaction'],
    }),
  }),
});

export const {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useGetMainStoreStockQuery,
  useAdjustMainStoreMutation,
  useTakeFromMainStoreMutation,
  useGetKitchenStockQuery,
  useAdjustKitchenMutation,
  useCreateMaterialRequestMutation,
  useGetMaterialRequestsQuery,
  useGetMaterialRequestByIdQuery,
  useReviewMaterialRequestMutation,
  useCreateOrUpdateRecipeMutation,
  useGetRecipeQuery,
  useGetTransactionHistoryQuery,
} = inventoryWorkflowApi;

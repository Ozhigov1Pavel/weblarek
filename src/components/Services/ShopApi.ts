
import type {
    IApi,
    IProductsResponse,
    IProduct,
    IOrderPayload,
    IOrderResponse,
  } from '../../types';
  import { ENDPOINTS } from '../../utils/constants';
  

  export class ShopApi {
    constructor(private readonly api: IApi) {}
  

    async getProducts(): Promise<IProduct[]> {
      const data = await this.api.get<IProductsResponse>(ENDPOINTS.products);
      return data.items;
    }
  

    async createOrder(payload: IOrderPayload): Promise<IOrderResponse> {
      return this.api.post<IOrderResponse>(ENDPOINTS.order, payload, 'POST');
    }
  }
  
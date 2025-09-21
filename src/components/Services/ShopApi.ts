
import type { IProduct, IOrderPayload, IOrderResponse } from '../../types';
import { ENDPOINTS } from '../../utils/constants';


type HttpClient = {
  get<T extends object>(url: string): Promise<T>;
  post<T extends object>(
    url: string,
    data: object,
    method?: 'POST' | 'PUT' | 'DELETE'
  ): Promise<T>;
};


type ServerOrderPayload = {
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: string[];  
  total?: number;
};

export class ShopApi {
  constructor(private api: HttpClient) {}

  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<any>(ENDPOINTS.products);
    if (Array.isArray(data)) return data as IProduct[];
    if (data && Array.isArray(data.items)) return data.items as IProduct[];
    console.warn('[ShopApi.getProducts] unexpected payload shape:', data);
    return [];
  }

  createOrder(payload: IOrderPayload): Promise<IOrderResponse> {

    const items: string[] = (payload.items as any[]).map((it) =>
      typeof it === 'string' ? it : it?.id
    );

    const body: ServerOrderPayload = {
      payment: payload.payment as 'card' | 'cash',
      address: payload.address!,
      email: payload.email!,
      phone: payload.phone!,
      items,
      total: (payload as any).total,
    };

    return this.api.post<IOrderResponse>(ENDPOINTS.order, body, 'POST');
  }
}

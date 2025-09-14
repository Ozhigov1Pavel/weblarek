export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type ProductId = string;
export type Price = number | null; // null = «Бесценно»
export type PaymentMethod = 'card' | 'cash';

export interface IListResponse<T> {
  total: number;
  items: T[];
}

export interface IProduct {
  id: ProductId;
  title: string;
  description: string;
  image: string;
  category: string;
  price: Price;
}

export interface IBasketItem {
  id: ProductId;
  title: string;
  price: Price;
}

export interface IBasketState {
  items: IBasketItem[];
  total: number; // всегда число
}

export interface IOrderDraft {
  payment?: PaymentMethod;
  address?: string;
  email?: string;
  phone?: string;
}

export interface IOrderPayload {
  items: { id: ProductId; price: Price }[];
  total: number;
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export type IProductsResponse = IListResponse<IProduct>;
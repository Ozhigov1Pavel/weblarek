import type { IProduct, ProductId } from '../../types';
import type { IEvents } from '../base/Events';

export class Products {
  private items: IProduct[] = [];

  constructor(private readonly events?: IEvents) {}

  setItems(items: IProduct[]) {
    this.items = Array.isArray(items) ? items.slice() : [];
    this.events?.emit('products:changed', { items: this.getItems() });
  }

  getItems(): IProduct[] {
    return this.items.slice();
  }

  getById(id?: ProductId): IProduct | undefined {
    if (!id) return undefined;
    return this.items.find((p) => p.id === id);
  }

  clear() {
    this.items = [];
    this.events?.emit('products:changed', { items: [] });
  }

  get length() {
    return this.items.length;
  }
}

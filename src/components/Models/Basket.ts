import type { IBasketItem, ProductId } from '../../types';
import type { IEvents } from '../base/Events';

type BasketState = {
  items: IBasketItem[];
  total: number;
};

export class Basket {
  private state: BasketState = { items: [], total: 0 };

  constructor(private readonly events?: IEvents) {}

  private recalc() {
    const total = this.state.items.reduce((sum, it) => sum + (it.price ?? 0), 0);
    this.state.total = total;
  }

  setItems(items: IBasketItem[]) {
    this.state.items = Array.isArray(items) ? items.slice() : [];
    this.recalc();
    this.events?.emit('basket:changed', this.getState());
  }

  add(item: IBasketItem) {
    if (!this.state.items.some((i) => i.id === item.id)) {
      this.state.items.push({ ...item });
      this.recalc();
      this.events?.emit('basket:changed', this.getState());
    }
  }

  remove(id: ProductId) {
    const before = this.state.items.length;
    this.state.items = this.state.items.filter((i) => i.id !== id);
    if (this.state.items.length !== before) {
      this.recalc();
      this.events?.emit('basket:changed', this.getState());
    }
  }

  clear() {
    this.state.items = [];
    this.recalc();
    this.events?.emit('basket:changed', this.getState());
  }

  getState(): BasketState {
    return {
      items: this.state.items.map((i) => ({ ...i })),
      total: this.state.total
    };
  }


  has(id: ProductId): boolean {
    return this.state.items.some((i) => i.id === id);
  }
}

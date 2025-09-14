import type { IBasketItem, IBasketState } from '../../types/index.ts';

export class Basket {
  private state: IBasketState = { items: [], total: 0 };

  setItems(items: IBasketItem[]): void {
    this.state.items = Array.isArray(items) ? [...items] : [];
    this.recalc();
  }

  add(item: IBasketItem): void {
    this.state.items.push({ ...item });
    this.recalc();
  }

  remove(id: string): void {
    this.state.items = this.state.items.filter(i => i.id !== id);
    this.recalc();
  }

  clear(): void {
    this.state = { items: [], total: 0 };
  }

  getState(): IBasketState {
    return {
      items: this.state.items.map(i => ({ ...i })),
      total: this.state.total,
    };
  }

  private recalc(): void {
    this.state.total = this.state.items.reduce((sum, i) => sum + (i.price ?? 0), 0);
  }
}

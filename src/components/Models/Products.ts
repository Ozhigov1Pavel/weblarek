import type { IProduct } from '../../types/';

export class Products {
  private items: IProduct[] = [];

  setItems(items: IProduct[]): void {
    this.items = Array.isArray(items) ? [...items] : [];
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getById(id: string): IProduct | undefined {
    return this.items.find(p => p.id === id);
  }

  clear(): void {
    this.items = [];
  }

  get length(): number {
    return this.items.length;
  }
}
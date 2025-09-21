import { Component } from '../Component';
import type { IEvents } from '../Events';
import { ProductCardView, type ProductCardProps } from './ProductCardView';

export interface CatalogState {
  items: ProductCardProps[];
}

export class CatalogView extends Component<CatalogState> {
  private root: HTMLElement;
  private cards: Map<string, ProductCardView> = new Map();
  private state: CatalogState = { items: [] };

  constructor(private readonly events: IEvents) {
    const container = document.querySelector('main.gallery') || document.createElement('main');
    if (!container.classList.contains('gallery')) container.classList.add('gallery');
    super(container as HTMLElement);
    this.root = container as HTMLElement;
  }

  setState(patch: Partial<CatalogState>) {
    this.state = { ...this.state, ...patch };
    this.render();
  }

  render(): HTMLElement {
    this.cards.clear();
    const nodes = this.state.items.map((p) => {
      const card = new ProductCardView(this.events, p);
      this.cards.set(p.id, card);
      return card.getElement();
    });

    this.root.replaceChildren(...nodes);
    return this.root;
  }
  

  getElement() {
    return this.root;
  }
}

import { Component } from '../base/Component';

type CatalogProps = {
  items: HTMLElement[];
};

export class CatalogView extends Component<CatalogProps> {
  private root: HTMLElement;

  constructor() {
    const container = document.querySelector('main.gallery') || document.createElement('main');
    if (!container.classList.contains('gallery')) container.classList.add('gallery');
    super(container as HTMLElement);
    this.root = container as HTMLElement;
  }


  set items(nodes: HTMLElement[]) {
    const list = Array.isArray(nodes) ? nodes : [];
    this.root.replaceChildren(...list);
  }

  render(): HTMLElement {
    return this.root;
  }

  getElement() {
    return this.root;
  }
}

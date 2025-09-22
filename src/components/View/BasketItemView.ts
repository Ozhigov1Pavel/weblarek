import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export type BasketItemProps = {
  id: string;
  index: number;
  title: string;
  priceText: string; 
};

export class BasketItemView extends Component<BasketItemProps> {
  private root: HTMLElement;
  private indexEl: HTMLElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    const tpl = document.getElementById('card-basket') as HTMLTemplateElement;
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(root);

    this.root = root;
    this.indexEl = root.querySelector('.basket__item-index') as HTMLElement;
    this.titleEl = root.querySelector('.card__title') as HTMLElement;
    this.priceEl = root.querySelector('.card__price') as HTMLElement;
    this.deleteBtn = root.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = this.deleteBtn.dataset.id;
      if (id) this.events.emit('basket/remove', { id });
    });
  }

  // сеттеры (вызываются через render({...}))
  set id(value: string) {
    this.deleteBtn.dataset.id = value;
  }
  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
  set title(value: string) {
    this.titleEl.textContent = value ?? '';
  }
  set priceText(value: string) {
    this.priceEl.textContent = value ?? '';
  }

  /** Важно: совместимая сигнатура */
  render(data?: Partial<BasketItemProps>): HTMLElement {
    super.render(data);
    return this.root;
  }
}

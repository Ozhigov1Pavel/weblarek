import { Component } from '../Component';
import type { IEvents } from '../Events';
import { settings } from '../../../utils/constants';

type BasketItemView = {
  id: string;
  title: string;
  price: number | null;
  index?: number;
};

type BasketState = {
  items: BasketItemView[];
  total: number;
};

export class BasketView extends Component<BasketState> {
  private root: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private emptyText = 'Корзина пуста';

  private state: BasketState = { items: [], total: 0 };

  constructor(private readonly events: IEvents) {
    const tpl = document.getElementById('basket') as HTMLTemplateElement;
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(root);

    this.root = root;
    this.listEl = root.querySelector('.basket__list') as HTMLElement;
    this.totalEl = root.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = root.querySelector('.basket__button') as HTMLButtonElement;
    this.root.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.basket__item-delete');
      if (btn && this.root.contains(btn)) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;

        if (id) {
          this.events.emit('basket/remove', { id });
        }
        return;
      }
      // Кнопка "Оформить"
      const checkout = (e.target as HTMLElement).closest<HTMLButtonElement>('.basket__button');
      if (checkout && this.root.contains(checkout)) {
        e.preventDefault();
        e.stopPropagation();
        this.events.emit('basket/checkout', {});
      }
    });
  }

  setState(state: BasketState) {
    this.state = {
      items: Array.isArray(state.items) ? state.items.slice() : [],
      total: state.total ?? 0,
    };
  }

  private renderEmpty() {
    const li = document.createElement('li');
    li.className = 'basket__item';
    li.textContent = this.emptyText;
    this.listEl.replaceChildren(li);
  }

  private formatPrice(price: number | null) {
    if (price === null) return settings.labels.freePrice;
    return `${price} ${settings.labels.currency}`;
  }

  render(): HTMLElement {
    const { items, total } = this.state;

    if (!items.length) {
      this.renderEmpty();
      this.checkoutBtn.disabled = true;
      this.totalEl.textContent = `0 ${settings.labels.currency}`;
      return this.root;
    }

    const itemTpl = document.getElementById('card-basket') as HTMLTemplateElement;
    const nodes: HTMLElement[] = items.map((it, idx) => {
      const node = itemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

      // индекс
      const indexEl = node.querySelector('.basket__item-index') as HTMLElement | null;
      if (indexEl) indexEl.textContent = String(it.index ?? idx + 1);

      // заголовок
      const titleEl = node.querySelector('.card__title') as HTMLElement | null;
      if (titleEl) titleEl.textContent = it.title;

      // цена
      const priceEl = node.querySelector('.card__price') as HTMLElement | null;
      if (priceEl) priceEl.textContent = this.formatPrice(it.price);

      // кнопка удаления — пробрасываем id в data-id
      const delBtn = node.querySelector('.basket__item-delete') as HTMLButtonElement | null;
      if (delBtn) delBtn.dataset.id = it.id;

      return node;
    });

    this.listEl.replaceChildren(...nodes);
    // Итого и доступность кнопки
    this.totalEl.textContent = `${total} ${settings.labels.currency}`;
    this.checkoutBtn.disabled = items.length === 0;

    return this.root;
  }
}

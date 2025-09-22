import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { settings } from '../../utils/constants';

type BasketViewProps = {
  items: HTMLElement[];
  total: number;
};

export class BasketView extends Component<BasketViewProps> {
  private root: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private emptyText = 'Корзина пуста';

  constructor(private readonly events: IEvents) {
    const tpl = document.getElementById('basket') as HTMLTemplateElement;
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(root);

    this.root = root;
    this.listEl = root.querySelector('.basket__list') as HTMLElement;
    this.totalEl = root.querySelector('.basket__price') as HTMLElement;
    this.checkoutBtn = root.querySelector('.basket__button') as HTMLButtonElement;

    this.checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('basket/checkout', {});
    });
  }


  set items(nodes: HTMLElement[]) {
    const list = Array.isArray(nodes) ? nodes : [];
    if (!list.length) {
      this.renderEmpty();
      this.checkoutBtn.disabled = true;
      return;
    }
    this.listEl.replaceChildren(...list);
    this.checkoutBtn.disabled = false;
  }

  set total(value: number) {
    const sum = typeof value === 'number' ? value : 0;
    this.totalEl.textContent = `${sum} ${settings.labels.currency}`;
  }

  private renderEmpty() {
    const li = document.createElement('li');
    li.className = 'basket__item';
    li.textContent = this.emptyText;
    this.listEl.replaceChildren(li);
  }

  render(data?: Partial<BasketViewProps>): HTMLElement {
    super.render(data);
    return this.root;
  }
}

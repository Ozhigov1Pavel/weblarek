import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type HeaderCartProps = { count: number };

export class HeaderCartButtonView extends Component<HeaderCartProps> {
  private root: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(private readonly events: IEvents) {
    const root = document.querySelector<HTMLButtonElement>('.header__basket');
    if (!root) throw new Error('HeaderCartButtonView: .header__basket not found');
    super(root);

    this.root = root;
    const counter = root.querySelector<HTMLElement>('.header__basket-counter');
    if (!counter) throw new Error('HeaderCartButtonView: .header__basket-counter not found');
    this.counterEl = counter;

    this.root.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit('basket/open', {});
    });
  }

  set count(value: number) {
    const n = typeof value === 'number' ? value : 0;
    this.counterEl.textContent = String(n);
  }

  render(data?: Partial<HeaderCartProps>): HTMLElement {
    super.render(data);
    return this.root;
  }
}

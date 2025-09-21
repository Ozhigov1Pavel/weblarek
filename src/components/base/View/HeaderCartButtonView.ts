import { Component } from '../Component';
import type { IEvents } from '../Events';

type HeaderCartState = { count: number };

export class HeaderCartButtonView extends Component<HeaderCartState> {
  private root: HTMLButtonElement;
  private counterEl: HTMLElement;
  private state: HeaderCartState = { count: 0 };

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

    this.apply();
  }

  setState(state: HeaderCartState) {
    this.state = { count: state.count ?? 0 };
    this.apply();
  }

  private apply() {
    this.counterEl.textContent = String(this.state.count);
  }

  render(): HTMLElement {
    return this.root;
  }
}

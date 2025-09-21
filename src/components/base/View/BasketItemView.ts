import type { IEvents } from '../Events';
import type { Price, ProductId } from '../../../types';
import { cloneTemplate } from './utils';
import { BaseCardView } from './BaseCardView';

export interface BasketItemProps {
  id: ProductId;
  title: string;
  price: Price;
  category?: string;
}

export class BasketItemView extends BaseCardView<BasketItemProps> {
  private root: HTMLElement;
  private delBtn: HTMLButtonElement;
  private id: ProductId;

  constructor(private readonly events: IEvents, props: BasketItemProps) {
    const root = cloneTemplate<HTMLElement>('card-basket');
    super(root);
    this.root = root;
    this.titleEl = root.querySelector('.card__title') as HTMLElement;
    this.priceEl = root.querySelector('.card__price') as HTMLElement;
    this.categoryEl = root.querySelector('.card__category') as HTMLElement;
    this.delBtn = root.querySelector('.card__button') as HTMLButtonElement;
    this.id = props.id;
    this.setTitle(props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);
    this.delBtn.addEventListener('click', () => {
      this.events.emit('basket/remove', { id: this.id });
    });
  }

  getElement() { return this.root; }
}

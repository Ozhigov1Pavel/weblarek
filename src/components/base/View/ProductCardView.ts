import type { IEvents } from '../Events';
import type { Price, ProductId } from '../../../types';
import { cloneTemplate } from './utils';
import { BaseCardView } from './BaseCardView';

export interface ProductCardProps {
  id: ProductId;
  title: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
}

export class ProductCardView extends BaseCardView<ProductCardProps> {
  private root: HTMLElement;
  private id: ProductId;

  constructor(private readonly events: IEvents, props: ProductCardProps) {
    const root = cloneTemplate<HTMLElement>('card-catalog');
    super(root);
    this.root = root;

    this.titleEl    = (root.querySelector('.card__title') as HTMLElement) || undefined;
    this.priceEl    = (root.querySelector('.card__price') as HTMLElement) || undefined;
    this.categoryEl = (root.querySelector('.card__category') as HTMLElement) || undefined;

    const imgNode = root.querySelector('.card__image') as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;

    this.id = props.id;

    this.setTitle(props.title);
    this.applyImage(props.image, props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);

    this.root.addEventListener('click', () => {
      this.events.emit('product/open', { id: this.id });
    });
  }

  getElement() {
    return this.root;
  }
}

import { Component } from '../Component';
import type { Price } from '../../../types';
import { categoryMap } from '../../../utils/constants';

export abstract class BaseCardView<T> extends Component<T> {
  protected titleEl?: HTMLElement;
  protected priceEl?: HTMLElement;
  protected categoryEl?: HTMLElement;
  protected imgEl?: HTMLImageElement;
  protected imgBoxEl?: HTMLElement; 

  protected setTitle(text?: string) {
    if (this.titleEl) this.titleEl.textContent = text ?? '';
  }

  protected applyImage(src?: string, alt?: string) {

    const isBad = !src || /<%=?\s*require/.test(src);
    const fallback = '/images/Subtract.svg';
    const url = isBad ? fallback : src;
  
    if (this.imgEl) {
      super.setImage(this.imgEl, url, alt);
    } else if (this.imgBoxEl) {
      this.imgBoxEl.style.backgroundImage = `url(${url})`;
      if (!this.imgBoxEl.style.backgroundSize) this.imgBoxEl.style.backgroundSize = 'cover';
      if (!this.imgBoxEl.style.backgroundPosition) this.imgBoxEl.style.backgroundPosition = 'center';
      if (!this.imgBoxEl.style.backgroundRepeat) this.imgBoxEl.style.backgroundRepeat = 'no-repeat';
    }
  }
  

  protected setPrice(price: Price) {
    if (!this.priceEl) return;
    this.priceEl.textContent = price === null ? 'Бесценно' : `${price} синапсов`;
  }

  protected setCategory(cat?: string) {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = cat ?? '';
    this.categoryEl.className = this.categoryEl.className.replace(/\bcard__category_[^\s]+/g, 'card__category');
    if (cat) {
      const key = cat as keyof typeof categoryMap;
      const mod = categoryMap[key];
      if (mod) this.categoryEl.classList.add(mod);
    }
  }
}

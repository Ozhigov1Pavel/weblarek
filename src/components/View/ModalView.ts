import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class ModalView extends Component<{ isOpen: boolean }> {
  private overlay: HTMLElement;
  private windowEl: HTMLElement;   
  private content: HTMLElement;
  private closeBtn: HTMLButtonElement;
  private lastActive: HTMLElement | null = null;

  constructor(private readonly events: IEvents) {
    const overlay = document.getElementById('modal-container') as HTMLElement;
    if (!overlay) throw new Error('Modal container #modal-container not found');
    super(overlay);

    this.overlay = overlay;
    this.windowEl = overlay.querySelector('.modal__container') as HTMLElement;
    this.content = overlay.querySelector('.modal__content') as HTMLElement;
    this.closeBtn = overlay.querySelector('.modal__close') as HTMLButtonElement;
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onClose = this.onClose.bind(this);
    this.closeBtn.addEventListener('click', this.onClose);
    this.overlay.addEventListener('click', this.onOverlayClick);
  }

  private onOverlayClick(e: MouseEvent) {
    if (e.target === this.overlay) this.close();
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.close();
  }

  private onClose() {
    this.close();
  }

  open(content?: HTMLElement) {
    this.lastActive = document.activeElement as HTMLElement;
    if (content) this.setContent(content);
    this.overlay.classList.add('modal_active');
    document.addEventListener('keydown', this.onKeydown);


    setTimeout(() => {
      this.windowEl
        .querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        ?.focus();
    }, 0);
  }

  close() {
    this.overlay.classList.remove('modal_active');
    this.setContent(document.createElement('div'));
    document.removeEventListener('keydown', this.onKeydown);
    this.lastActive?.focus();
    this.events.emit('modal/close', {});
  }

  setContent(node: HTMLElement) {
    this.content.replaceChildren(node);
  }

  getElement(): HTMLElement {
    return this.overlay;
  }
}

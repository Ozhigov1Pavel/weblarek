import { Component } from '../base/Component';

export class SuccessView extends Component<unknown> {
  private root: HTMLElement;
  private textEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor() {
    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const root = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(root);
    this.root = root;
    this.textEl = root.querySelector('.order-success__description') as HTMLElement;
    this.closeBtn = root.querySelector('.order-success__close') as HTMLButtonElement;
  }

  /** Задать текст описания */
  setText(text: string) {
    this.textEl.textContent = text;
  }

  /** Повесить обработчик закрытия */
  onClose(handler: () => void) {
    this.closeBtn.addEventListener('click', handler);
  }

  render(): HTMLElement {
    return this.root;
  }
}

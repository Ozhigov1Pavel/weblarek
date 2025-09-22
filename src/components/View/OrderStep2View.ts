import { BaseFormView } from './BaseFormView';
import type { IEvents } from '../base/Events';

export type OrderStep2Props = {
  email?: string;
  phone?: string;
  errors?: string[];
  canPay?: boolean;
};

export class OrderStep2View extends BaseFormView<OrderStep2Props> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(private readonly events: IEvents) {
    const tpl = document.getElementById('contacts') as HTMLTemplateElement;
    const form = tpl.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    super(form);

    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.setSubmitDisabled(true);
    this.emailInput.addEventListener('input', () => {
      this.events.emit('order/step2/change', { data: { email: this.emailInput.value, phone: this.phoneInput.value } });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('order/step2/change', { data: { email: this.emailInput.value, phone: this.phoneInput.value } });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order/step2/pay', { data: { email: this.emailInput.value, phone: this.phoneInput.value } });
    });
  }

 
  set email(value: string | undefined) {
    if (typeof value === 'string') this.emailInput.value = value;
  }

  set phone(value: string | undefined) {
    if (typeof value === 'string') this.phoneInput.value = value;
  }

  set errors(list: string[] | undefined) {
    this.setError(Array.isArray(list) ? list.join('. ') : '');
  }

  set canPay(value: boolean | undefined) {
    this.setSubmitDisabled(!(value ?? false));
  }

  render(data?: Partial<OrderStep2Props>): HTMLElement {
    super.render(data);
    return this.formEl;
  }
}

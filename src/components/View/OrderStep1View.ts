import type { IEvents } from '../base/Events';
import type { PaymentMethod } from '../../types';
import { cloneTemplate } from './utils';
import { BaseFormView } from './BaseFormView';

export type OrderStep1Props = {
  payment?: PaymentMethod | null;
  address?: string;
  errors?: string[];
  canNext?: boolean;
};

export class OrderStep1View extends BaseFormView<OrderStep1Props> {
  private addressInput: HTMLInputElement;
  private payCardBtn: HTMLButtonElement;
  private payCashBtn: HTMLButtonElement;

  constructor(private readonly events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('order');
    super(form);

    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.payCardBtn = form.querySelector('button[name="card"]') as HTMLButtonElement;
    this.payCashBtn = form.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;

    this.setSubmitDisabled(true);

    this.payCardBtn.addEventListener('click', () => {
      this.events.emit('order/step1/change', {
        data: { payment: 'card' as PaymentMethod, address: this.addressInput.value },
      });
    });
    this.payCashBtn.addEventListener('click', () => {
      this.events.emit('order/step1/change', {
        data: { payment: 'cash' as PaymentMethod, address: this.addressInput.value },
      });
    });
    this.addressInput.addEventListener('input', () => {
      const payment =
        this.payCardBtn.classList.contains('button_alt-active')
          ? ('card' as PaymentMethod)
          : this.payCashBtn.classList.contains('button_alt-active')
          ? ('cash' as PaymentMethod)
          : null;
      this.events.emit('order/step1/change', { data: { payment, address: this.addressInput.value } });
    });

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const payment =
        this.payCardBtn.classList.contains('button_alt-active')
          ? ('card' as PaymentMethod)
          : this.payCashBtn.classList.contains('button_alt-active')
          ? ('cash' as PaymentMethod)
          : null;
      this.events.emit('order/step1/next', { data: { payment, address: this.addressInput.value } });
    });
  }

  set payment(value: PaymentMethod | null | undefined) {
    this.payCardBtn.classList.toggle('button_alt-active', value === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string | undefined) {
    if (typeof value === 'string') this.addressInput.value = value;
  }

  set errors(list: string[] | undefined) {
    this.setError(Array.isArray(list) ? list.join('. ') : '');
  }

  set canNext(value: boolean | undefined) {
    this.setSubmitDisabled(!(value ?? false));
  }

  render(data?: Partial<OrderStep1Props>): HTMLElement {
    super.render(data);
    return this.formEl;
  }
}

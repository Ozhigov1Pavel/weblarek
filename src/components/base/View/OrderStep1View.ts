import type { IEvents } from '../Events';
import type { PaymentMethod } from '../../../types';
import { cloneTemplate } from './utils';
import { BaseFormView } from './BaseFormView';

export interface OrderStep1State {
  payment: PaymentMethod | null;
  address: string;
  errors: { payment?: string; address?: string };
}

export class OrderStep1View extends BaseFormView<OrderStep1State> {
  private addressInput: HTMLInputElement;
  private payCardBtn: HTMLButtonElement;
  private payCashBtn: HTMLButtonElement;

  private state: OrderStep1State = { payment: null, address: '', errors: {} };

  constructor(private readonly events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('order');
    super(form);
    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.payCardBtn = form.querySelector('button[name="card"]') as HTMLButtonElement;
    this.payCashBtn = form.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;

    const setPayment = (m: PaymentMethod) => {
      this.state.payment = m;
      this.validate(); this.render();
    };
    this.payCardBtn.addEventListener('click', () => setPayment('card'));
    this.payCashBtn.addEventListener('click', () => setPayment('cash'));
    this.addressInput.addEventListener('input', () => {
      this.state.address = this.addressInput.value;
      this.validate(); this.render();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
      if (!this.hasErrors()) {
        this.events.emit('order/step1/next', { data: { payment: this.state.payment!, address: this.state.address } });
      }
    });

    this.render();
  }

  private hasErrors() { return Boolean(this.state.errors.payment || this.state.errors.address); }
  private validate() {
    const errors: OrderStep1State['errors'] = {};
    if (!this.state.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.state.address || this.state.address.trim().length === 0) errors.address = 'Введите адрес';
    this.state.errors = errors;
    this.setSubmitDisabled(this.hasErrors());
  }

  render(): HTMLElement {
    this.payCardBtn.classList.toggle('button_alt-active', this.state.payment === 'card');
    this.payCashBtn.classList.toggle('button_alt-active', this.state.payment === 'cash');
    this.setError(this.state.errors.payment || this.state.errors.address || '');
    this.setSubmitDisabled(this.hasErrors());
    return this.formEl;
  }
}

import type { IEvents } from '../Events';
import { cloneTemplate } from './utils';
import { BaseFormView } from './BaseFormView';

export interface OrderStep2State {
  email: string;
  phone: string;
  errors: { email?: string; phone?: string };
}

export class OrderStep2View extends BaseFormView<OrderStep2State> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private state: OrderStep2State = { email: '', phone: '', errors: {} };

  constructor(private readonly events: IEvents) {
    const form = cloneTemplate<HTMLFormElement>('contacts');
    super(form);
    this.submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = form.querySelector('.form__errors') as HTMLElement;
    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;

    const onInput = () => {
      this.state.email = this.emailInput.value;
      this.state.phone = this.phoneInput.value;
      this.validate(); this.render();
    };
    this.emailInput.addEventListener('input', onInput);
    this.phoneInput.addEventListener('input', onInput);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
      if (!this.hasErrors()) {
        this.events.emit('order/step2/pay', { data: { email: this.state.email, phone: this.state.phone } });
      }
    });

    this.render();
  }

  private hasErrors() { return Boolean(this.state.errors.email || this.state.errors.phone); }
  private validate() {
    const errors: OrderStep2State['errors'] = {};
    if (!this.state.email || !this.state.email.includes('@')) errors.email = 'Введите e-mail';
    if (!this.state.phone || this.state.phone.replace(/\D/g, '').length < 10) errors.phone = 'Введите телефон';
    this.state.errors = errors;
    this.setSubmitDisabled(this.hasErrors());
  }

  render(): HTMLElement {
    this.setError(this.state.errors.email || this.state.errors.phone || '');
    this.setSubmitDisabled(this.hasErrors());
    return this.formEl;
  }
}

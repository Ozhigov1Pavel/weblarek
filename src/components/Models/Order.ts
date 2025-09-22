import type { IOrderDraft } from '../../types';
import type { IEvents } from '../base/Events';

export class Order {
  private draft: IOrderDraft = {
    payment: undefined,
    address: '',
    email: '',
    phone: ''
  };

  constructor(private readonly events?: IEvents) {}

  setDraft(draft: IOrderDraft) {
    this.draft = { ...draft };
    this.events?.emit('order:changed', { draft: this.getDraft() });
  }

  patchDraft(patch: Partial<IOrderDraft>) {
    this.draft = { ...this.draft, ...patch };
    this.events?.emit('order:changed', { draft: this.getDraft() });
  }

  getDraft(): IOrderDraft {
    return { ...this.draft };
  }

  reset() {
    this.draft = {
      payment: undefined,
      address: '',
      email: '',
      phone: ''
    };
    this.events?.emit('order:changed', { draft: this.getDraft() });
    this.events?.emit('order:reset', {});
  }

  validateStep1(): string[] {
    const d = this.getDraft();
    const errors: string[] = [];
    if (!d.payment) errors.push('Выберите способ оплаты');
    if (!d.address || !d.address.trim()) errors.push('Введите адрес доставки');
    return errors;
  }

  /** Валидация шага 2: email + phone (базовая) */
  validateStep2(): string[] {
    const d = this.getDraft();
    const errors: string[] = [];
    const email = d.email?.trim() ?? '';
    const phone = d.phone?.trim() ?? '';

    // простая проверка e-mail
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !emailOk) errors.push('Введите корректный email');

    // простая проверка телефона (минимум 8 цифр)
    const digits = phone.replace(/\D/g, '');
    if (!phone || digits.length < 8) errors.push('Введите корректный телефон');

    return errors;
  }
}

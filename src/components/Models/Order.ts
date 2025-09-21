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
}

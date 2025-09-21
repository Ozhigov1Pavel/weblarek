import { EventEmitter } from './Events';

export const events = new EventEmitter();

export type AppEvent =
  | { type: 'product/open'; id: string }
  | { type: 'product/add'; id: string }
  | { type: 'product/remove'; id: string }
  | { type: 'basket/open' }
  | { type: 'basket/remove'; id: string }
  | { type: 'basket/checkout' }
  | { type: 'order/step1/next'; data: { payment: 'card' | 'cash'; address: string } }
  | { type: 'order/step2/pay'; data: { email: string; phone: string } }
  | { type: 'modal/close' };

import type { IOrderDraft } from '../../types/index.ts';

export class Order {
  private draft: IOrderDraft = {};

  setDraft(draft: IOrderDraft): void {
    this.draft = { ...draft };
  }

  patchDraft(patch: Partial<IOrderDraft>): void {
    this.draft = { ...this.draft, ...patch };
  }

  getDraft(): IOrderDraft {
    return { ...this.draft };
  }

  reset(): void {
    this.draft = {};
  }
}

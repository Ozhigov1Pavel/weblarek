import { Component } from '../base/Component';

export abstract class BaseFormView<T> extends Component<T> {
  protected formEl: HTMLFormElement;
  protected submitBtn!: HTMLButtonElement;
  protected errorsEl!: HTMLElement;

  constructor(formEl: HTMLFormElement) {
    super(formEl);
    this.formEl = formEl;
  }

  protected setError(message: string) {
    if (this.errorsEl) {
      this.errorsEl.textContent = message;
    }
  }

  protected setSubmitDisabled(disabled: boolean) {
    if (this.submitBtn) {
      this.submitBtn.disabled = disabled;
    }
  }

  render(data?: Partial<T>): HTMLElement {
    super.render(data);
    return this.formEl;
  }
}

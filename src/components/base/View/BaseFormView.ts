import { Component } from '../Component';

export abstract class BaseFormView<T> extends Component<T> {
  protected formEl: HTMLFormElement;
  protected submitBtn?: HTMLButtonElement;
  protected errorsEl?: HTMLElement;

  constructor(form: HTMLFormElement) {
    super(form);
    this.formEl = form;
  }

  protected setError(text: string) {
    if (this.errorsEl) this.errorsEl.textContent = text;
  }

  protected setSubmitDisabled(disabled: boolean) {
    if (this.submitBtn) this.submitBtn.disabled = disabled;
  }

  render(): HTMLElement {
    return this.formEl;
  }
}

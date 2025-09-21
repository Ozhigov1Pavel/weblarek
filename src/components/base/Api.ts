type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl ?? '';
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as object ?? {})
      },
      ...options
    };
  }


  protected buildUrl(uri: string): string {
    if (/^https?:\/\//i.test(uri)) return uri;
    return `${this.baseUrl}${uri}`;
  }

  protected handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) return Promise.resolve(undefined as unknown as T);
    if (response.ok) return response.json();
    return response
      .json()
      .catch(() => ({}))
      .then((data) => Promise.reject((data as any).error ?? response.statusText));
  }

  get<T extends object>(uri: string) {
    return fetch(this.buildUrl(uri), {
      ...this.options,
      method: 'GET'
    }).then(this.handleResponse<T>);
  }

  post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
    return fetch(this.buildUrl(uri), {
      ...this.options,
      method,
      body: JSON.stringify(data)
    }).then(this.handleResponse<T>);
  }
}

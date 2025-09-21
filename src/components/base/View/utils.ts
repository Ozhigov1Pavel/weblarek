export function cloneTemplate<T extends HTMLElement = HTMLElement>(id: string): T {
    const tpl = document.getElementById(id) as HTMLTemplateElement | null;
    if (!tpl || !('content' in tpl)) throw new Error(`Template #${id} not found`);
    return tpl.content.firstElementChild!.cloneNode(true) as T;
  }
  
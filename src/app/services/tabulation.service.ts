import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
// TODO: FIX FILE STRUCTURE
@Injectable({
  providedIn: 'root',
})
export class TabulationService {
  private renderer: Renderer2;
  listeners: (() => void)[] = [];
  box: HTMLElement | null = null;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  releaseTabulation() {
    this.clearListeners();
    this.box = null;
  }

  trapTabulation(box: HTMLElement, startFocusWith?: HTMLElement) {
    if (this.box) {
      this.clearListeners();
    }
    this.box = box;
    startFocusWith?.focus();
    const listener = this.renderer.listen(
      box,
      'keydown',
      this.onKeydown.bind(this)
    );
    this.listeners.push(listener);
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') {
      return;
    }
    if(!this.box) {
      return;
    }

    const focusableChilds = this.getFocusableChilds();
    const first = focusableChilds[0];
    const last = focusableChilds[focusableChilds.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    }

    if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }

  private clearListeners() {
    for (const listener of this.listeners) {
      listener();
    }
    this.listeners = [];
  }

  private getFocusableChilds() {
    if (!this.box) {
      return [];
    }
    const focusableChilds = this.box.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    ) as NodeListOf<HTMLButtonElement | HTMLLinkElement | HTMLInputElement>;
    return focusableChilds;
  }
}

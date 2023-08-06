import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { FocusableElement } from './focusable-child';
@Injectable({
  providedIn: 'root',
})
export class TabulationService {
  private renderer: Renderer2;
  private listeners: (() => void)[] = [];
  private box: HTMLElement | null = null;
  private focusableChilds: NodeListOf<FocusableElement> | null = null;
  private firstFocusableChild: FocusableElement | null = null;
  private lastFocusableChild: FocusableElement | null = null;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  releaseTabulation() {
    this.clearListeners();
    this.box = null;
    this.focusableChilds = null;
    this.firstFocusableChild = null;
    this.lastFocusableChild = null;
  }

  trapTabulation(box: HTMLElement, startFocusWith?: HTMLElement) {
    if (this.box) {
      this.releaseTabulation();
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
    if (!this.focusableChilds) {
      this.updateFocusableChilds();
    }

    if (e.key !== 'Tab') {
      return;
    }
    if (!this.box) {
      return;
    }

    if (e.shiftKey && document.activeElement === this.firstFocusableChild) {
      this.lastFocusableChild?.focus();
      e.preventDefault();
    }

    if (!e.shiftKey && document.activeElement === this.lastFocusableChild) {
      this.firstFocusableChild?.focus();
      e.preventDefault();
    }
  }

  private clearListeners() {
    for (const listener of this.listeners) {
      listener();
    }
    this.listeners = [];
  }

  private updateFocusableChilds() {
    const focusableChilds = this.box?.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    ) as NodeListOf<HTMLButtonElement | HTMLLinkElement | HTMLInputElement>;
    this.focusableChilds = focusableChilds;
    this.firstFocusableChild = this.focusableChilds[0];
    this.lastFocusableChild =
      this.focusableChilds[this.focusableChilds.length - 1];
    return focusableChilds;
  }
}

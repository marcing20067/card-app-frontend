import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private blockScrollValue = false;
  private blockScroll$ = new BehaviorSubject<boolean>(false);

  getBlockScrollListener() {
    return this.blockScroll$.asObservable();
  }

  blockScroll() {
    if (this.blockScrollValue === true) {
      return;
    }

    this.blockScrollValue = true;
    this.blockScroll$.next(true);
    document.body.classList.add('block-scroll');
  }

  unLockScroll() {
    if (this.blockScrollValue === false) {
      return;
    }
    this.blockScrollValue = false;
    this.blockScroll$.next(false);
    document.body.classList.remove('block-scroll');
  }
}

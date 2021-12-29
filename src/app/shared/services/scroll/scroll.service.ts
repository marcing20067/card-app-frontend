import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private blockScroll$ = new BehaviorSubject<boolean>(false);

  getBlockScrollListener() {
    return this.blockScroll$.asObservable();
  }

  blockScroll() {
    this.blockScroll$.next(true);
    document.body.classList.add('block-scroll');
  }

  unLockScroll() {
    this.blockScroll$.next(false);
    document.body.classList.remove('block-scroll');
  }
}

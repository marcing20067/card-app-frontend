import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TabulationService } from 'src/app/shared/services/tabulation/tabulation.service';
import { GLOBAL_ELEMENTS } from 'src/app/shared/util/global-elements';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
  providers: [GLOBAL_ELEMENTS],
})
export class NavListComponent implements OnInit, OnDestroy {
  @Output() private nav = new EventEmitter<boolean>();
  isActive = false;
  isAuth$ = this.authService.getIsAuthListener();
  private resize$ = fromEvent(window, 'resize');
  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private popupService: PopupService,
    private scrollService: ScrollService,
    private tabulationService: TabulationService,
    @Inject('popup') private popupEl: HTMLElement,
    @Inject('nav') private navEl: HTMLElement
  ) {
    this.authService.isAuth();
  }

  get navItemTabIndex() {
    return window.innerWidth >= 1050 || this.isActive ? 0 : -1;
  }
  
  ngOnInit() {
    this.sub = this.resize$
      .pipe(map((event) => (<Window>event.target).innerWidth < 1050))
      .subscribe((isMobile) => {
        if (!isMobile && this.isActive && !this.popupService.getIsOpen()) {
          this.scrollService.unLockScroll();
          this.tabulationService.releaseTabulation();
        }

        if (isMobile && this.isActive) {
          this.scrollService.blockScroll();
          this.tabulationService.trapTabulation(this.navEl);
        }
      });
  }

  onNav(value: boolean) {
    this.isActive = value;
    this.nav.emit(value);
    if (this.isActive) {
      this.scrollService.blockScroll();
      this.tabulationService.trapTabulation(this.navEl);
      return;
    }
    this.scrollService.unLockScroll();
    this.tabulationService.releaseTabulation();
  }

  onLogout() {
    const previousTab = document.activeElement as HTMLElement;
    this.popupService
      .getConfirmEventListener()
      .pipe(take(1))
      .subscribe((isConfirm) => {
        if (isConfirm) {
          this.tabulationService.releaseTabulation();
          this.authService.logout().pipe(take(1)).subscribe();
          return;
        }

        if (window.innerWidth < 1050 && this.isActive) {
          this.tabulationService.trapTabulation(this.navEl, previousTab);
          return;
        }
        this.tabulationService.releaseTabulation();
      });

    this.popupService.display({
      content: {
        heading: 'Czy na pewno chcesz się wylogować?',
      },
    });
    this.tabulationService.trapTabulation(this.popupEl);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

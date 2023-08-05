import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TabulationService } from 'src/app/shared/services/tabulation/tabulation.service';
import { GLOBAL_ELEMENTS } from 'src/app/shared/util/global-elements';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
  providers: [GLOBAL_ELEMENTS],
})
export class NavListComponent {
  @Output() private nav = new EventEmitter<boolean>();
  isActive = false;
  isAuth$ = this.tokenService.getIsAuthListener();
  isMobile = false;
  resize$ = fromEvent(window, 'resize').pipe(
    map((event) => (<Window>event.target).innerWidth < 1050)
  );
  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private popupService: PopupService,
    private scrollService: ScrollService,
    private tabulationService: TabulationService,
    @Inject('popup') private popupEl: HTMLElement,
    @Inject('nav') private navEl: HTMLElement
  ) {
    this.tokenService.isAuth();
  }

  ngOnInit() {
    this.sub = this.resize$.subscribe((isMobile) => {
      if (!isMobile && this.isActive) {
        this.scrollService.unLockScroll();
        this.tabulationService.releaseTabulation();
      }

      if (isMobile && this.isActive) {
        this.scrollService.blockScroll();
        this.tabulationService.trapTabulation(this.navEl);
      }
    });
  }

  get navItemTabIndex() {
    return window.innerWidth >= 1050 || this.isActive ? 0 : -1;
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
        this.tabulationService.trapTabulation(this.navEl, previousTab);
      });

    this.popupService.display({
      content: {
        heading: 'Czy na pewno chcesz się wylogować?',
      },
    });
    this.tabulationService.trapTabulation(this.popupEl);
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}

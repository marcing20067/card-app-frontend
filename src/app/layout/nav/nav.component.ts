import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NavExtraFeaturesForRoute } from 'src/app/shared/enums/layout.enums';
import { PopupService } from 'src/app/shared/services/popup/popup.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  class = ['nav'];
  isActive = false;
  isAuth$ = this.tokenService.getIsAuthListener();

  constructor(
    private location: Location,
    private tokenService: TokenService,
    private popupService: PopupService,
    private router: Router
    ) {
    this.location.onUrlChange((path) => {
      this.class = ['nav'];
      const splitedPath = path.split('/');
      if (splitedPath.length > 3) {
        path = splitedPath.slice(0, splitedPath.length - 1).join('/') + '/:id';
      }
      const actualRoute = path as ActualRoute;
      const extraFeatures = NavExtraFeaturesForRoute[actualRoute];
      if (extraFeatures) {
        extraFeatures.split(' ').forEach((feature) => {
          if (!feature) return;
          this.class.push(`nav--${feature}`);
        });
      }
    });
    this.tokenService.isAuth();
  }

  toggleIsActive() {
    this.isActive = !this.isActive;
  }

  onLogout() {
    this.popupService.getConfirmEventListener().pipe(take(1)).subscribe(isConfirm => {
      if(isConfirm) {
        this.tokenService.clearTokenData();
        this.router.navigate(['/auth/login'])
      }
    })

    this.popupService.display({
      isShow: true,
      content: {
        heading: 'Czy na pewno chcesz się wylogować?'
      }
    })
  }
}

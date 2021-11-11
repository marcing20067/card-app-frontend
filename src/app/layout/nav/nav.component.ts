import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavExtraFeaturesForRoute } from 'src/app/shared/enums/layout.enums';
import { TokenService } from 'src/app/shared/services/token.service';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';

type NavFeature = 'banner' | 'desktop-no-bgc';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  class = ['nav'];
  isActive = false;
  isAuth$ = this.tokenService.getIsAuthListener();

  constructor(private location: Location, private tokenService: TokenService) {
    this.location.onUrlChange((path) => {
      this.class = ['nav'];
      const actualRoute = path as ActualRoute;
      const extraFeatures = NavExtraFeaturesForRoute[actualRoute];

      extraFeatures.split(' ').forEach((feature) => {
        if (!feature) return;
        this.class.push(`nav--${feature}`);
      });
    });

    this.tokenService.isAuth().subscribe();
  }

  toggleIsActive() {
    this.isActive = !this.isActive;
  }
}

import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';
import { FooterExtraFeaturesForRoute } from '../../shared/enums/layout.enums';

type FooterExtraFeature = 'no-footer' | 'creamy-bgc' | 'desktop-pill-items';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  extraFeature: FooterExtraFeature | '' = '';
  constructor(private location: Location) {
    this.location.onUrlChange((actualRoute) => {
      const splitedRoute = actualRoute.split('/');
      if (splitedRoute.length === 4) {
        splitedRoute[splitedRoute.length - 1] = ':id';
        const route = splitedRoute.join('/');
        this.extraFeature =
          FooterExtraFeaturesForRoute[route as ActualRoute];
        return;
      }
      this.extraFeature =
        FooterExtraFeaturesForRoute[actualRoute as ActualRoute];
    });
  }
}

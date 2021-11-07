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
export class FooterComponent{
  extraFeature: FooterExtraFeature | '' = '';
  constructor(private location: Location) {
    this.location.onUrlChange((actualRoute) => {
      this.extraFeature =
        FooterExtraFeaturesForRoute[actualRoute as ActualRoute];
    });
  }

}

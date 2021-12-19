import { Location } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';
import { FooterExtraFeaturesForRoute } from '../../shared/enums/layout.enums';

type FooterExtraFeature =
  | 'no-footer'
  | 'creamy-bgc'
  | 'desktop-pill-items'
  | 'mobile-no-footer'
  | 'creamy-bgc mobile-no-footer';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @ViewChild('footer') footer!: ElementRef;

  extraFeature: FooterExtraFeature | '' = '';

  constructor(private location: Location, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.location.onUrlChange((actualRoute) => {
      const splitedRoute = actualRoute.split('/');

      if (splitedRoute.length === 4) {
        splitedRoute[splitedRoute.length - 1] = ':id';
        const route = splitedRoute.join('/');
        this.extraFeature = FooterExtraFeaturesForRoute[route as ActualRoute];
      } else {
        this.extraFeature =
          FooterExtraFeaturesForRoute[actualRoute as ActualRoute];
      }

      const extraFeatures = this.extraFeature.split(' ');

      extraFeatures.forEach((feature) => {
        if (!feature) return;
        this.renderer.addClass(this.footer.nativeElement, `footer--${feature}`);
      });
    });
  }
}

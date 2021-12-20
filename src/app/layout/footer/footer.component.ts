import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActualRoute } from 'src/app/shared/types/actualRoute.type';
import { FooterExtraFeaturesForRoute } from '../../shared/enums/layout.enums';
import { LayoutService } from '../layout.service';

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
export class FooterComponent implements OnInit, OnDestroy {
  class = ['footer'];
  sub!: Subscription;
  extraFeature: FooterExtraFeature | '' = '';

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.sub = this.layoutService.onUrlChange('Footer').subscribe((feature) => {
      this.class = ['footer'];
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`footer--${f}`);
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

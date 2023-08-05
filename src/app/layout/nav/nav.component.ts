import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  class = ['nav'];
  gotFeatures!: boolean;
  isActive!: boolean;
  private sub!: Subscription;

  constructor(
    private layoutService: LayoutService,
  ) {}

  onNav(isActive: boolean) {
    this.isActive = isActive;
  }

  ngOnInit() {
    this.sub = this.layoutService.onUrlChange('nav').subscribe((feature) => {
      this.class = ['nav'];
      if (feature) {
        feature.split(' ').forEach((f) => {
          if (!f) return;
          this.class.push(`nav--${f}`);
        });
      }
      this.gotFeatures = true;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

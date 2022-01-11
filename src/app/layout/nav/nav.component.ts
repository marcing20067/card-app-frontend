import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  class = ['nav'];
  gotFeatures!: boolean;
  isActive!: boolean;

  constructor(
    private layoutService: LayoutService,
  ) {}

  ngOnInit() {
    this.sub = this.layoutService.onUrlChange('nav').subscribe((feature) => {
      this.class = ['nav'];
      if (!feature) {
        // No features; set default styles
        this.gotFeatures = true;
        return;
      }
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`nav--${f}`);
      });
      this.gotFeatures = true;
    });
  }

  onNav(isActive: boolean) {
    this.isActive = isActive;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

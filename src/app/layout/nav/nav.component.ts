import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  class = ['nav'];
  isActive!: boolean;

  constructor(
    private layoutService: LayoutService,
    private scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.sub = this.layoutService.onUrlChange('nav').subscribe((feature) => {
      this.class = ['nav'];
      if (!feature) {
        // No features; set default styles
        return;
      }
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`nav--${f}`);
      });
    });
  }

  onNav(isActive: boolean) {
    this.isActive = isActive;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

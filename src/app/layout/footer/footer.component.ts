import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  class = ['footer'];

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.sub = this.layoutService.onUrlChange('footer').subscribe((feature) => {
      this.class = ['footer'];
      if (!feature) {
        // No features; set default styles
        return;
      }
      feature.split(' ').forEach((f) => {
        if (!f) return;
        this.class.push(`footer--${f}`);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

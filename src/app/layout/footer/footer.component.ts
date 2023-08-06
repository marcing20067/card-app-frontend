import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from '../shared/layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  class = ['footer'];
  private sub!: Subscription;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.sub = this.layoutService.onUrlChange('footer').subscribe((feature) => {
      this.class = ['footer'];
      if (!feature) {
        return;
      }
      feature.split(' ').forEach((f) => {
        this.class.push(`footer--${f}`);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

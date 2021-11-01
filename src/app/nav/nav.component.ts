import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

type Feature = '';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() extraFeatures: Feature[] = [];
  isActive = false;
  isAuth = false;
  path = this.location.path();

  constructor(private location: Location) {}

  toggleIsActive() {
    this.isActive = !this.isActive;
  }
}

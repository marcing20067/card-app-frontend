import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TokenService } from 'src/app/shared/services/token.service';

type Feature = '';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() extraFeatures: Feature[] = [];
  isActive = false;
  isAuth$ = this.tokenService.getIsAuthListener();
  path = this.location.path();

  constructor(private location: Location, private tokenService: TokenService) {
    this.tokenService.isAuth().subscribe()
  }

  toggleIsActive() {
    this.isActive = !this.isActive;
  }
}

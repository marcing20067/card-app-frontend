import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { UserStatus } from './shared/user-status.model';
import { UserPanelService } from './shared/user-panel.service';
import { ResetService } from '../shared/services/reset/reset.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isLoading = true;
  userStatus!: UserStatus;
  showPopup = false;

  constructor(
    private userPanelService: UserPanelService,
    private resetService: ResetService
  ) {}

  onReset(mode: 'username' | 'password') {
    this.isLoading = true;
    this.resetService
      .reset(mode, this.userStatus.username)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
        this.showPopup = true;
      });
  }

  onClose() {
    this.showPopup = false;
  }

  ngOnInit() {
    this.userPanelService
      .userStatus()
      .pipe(take(1))
      .subscribe((status) => {
        this.userStatus = status;
        this.isLoading = false;
      });
  }
}

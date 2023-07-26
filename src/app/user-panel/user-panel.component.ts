import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { UserStatus } from '../shared/models/user-status.model';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  isLoading = true;
  userStatus!: UserStatus;
  showPopup = false;

  constructor(private authService: AuthService) {}

  onReset(mode: 'username' | 'password') {
    this.isLoading = true;
    this.authService
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
    this.authService
      .userStatus()
      .pipe(take(1))
      .subscribe((status) => {
        this.userStatus = status;
        this.isLoading = false;
      });
  }
}

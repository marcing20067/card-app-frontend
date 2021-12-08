import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../shared/models/userStatus.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  userStatus!: UserStatus;
  showPopup = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userStatus().subscribe((status) => {
      this.userStatus = status;
    });
  }

  onReset(mode: 'username' | 'password') {
    this.authService.reset(mode, this.userStatus.username).subscribe(() => {
      this.showPopup = true;
    });
  }

  onClose() {
    this.showPopup = false;
  }

}

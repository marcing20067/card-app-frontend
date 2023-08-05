import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStatus } from 'src/app/user-panel/shared/user-status.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserPanelService {
  userStatus() {
    return this.http.get<UserStatus>(environment.BACKEND_URL + 'auth/status');
  }

  constructor(private http: HttpClient) { }
}

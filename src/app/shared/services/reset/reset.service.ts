import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResetUsernameData } from './reset-username-data.model';
import { ResetPasswordData } from './reset-password-data.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ResetService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  resetWithToken(
    mode: 'password' | 'username',
    token: string,
    data: ResetUsernameData | ResetPasswordData
  ) {
    return this.http
      .put(environment.BACKEND_URL + `reset/${mode}/${token}`, data)
      .pipe(
        tap(() => {
          this.authService.logout().pipe(take(1)).subscribe();
        })
      );
  }

  reset(mode: 'password' | 'username', username: string) {
    return this.http.post(environment.BACKEND_URL + `reset/${mode}`, {
      username
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth/auth.service';
import { ResetPasswordData } from './reset-password-form/reset-password-data.model';
import { ResetUsernameData } from './reset-username-form/reset-username-data.model';

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
}

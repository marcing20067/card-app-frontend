import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RefreshGuard implements CanLoad {
  constructor(private authService: AuthService) {}
  canLoad(): Observable<boolean> {
    return this.authService.getIsRefreshCalledListener().pipe(
      take(1),
      switchMap((isCalled) => {
        if (!isCalled) {
          return this.authService.refresh().pipe(
            take(1),
            switchMap(() => {
              return of(true);
            })
          );
        }
        return of(true);
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}

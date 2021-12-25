import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
          return this.authService.refresh().pipe(take(1));
        }
        return of(true);
      })
    );
  }
}

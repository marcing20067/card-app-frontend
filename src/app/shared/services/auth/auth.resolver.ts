import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private authService: AuthService) {}
  resolve(): Observable<boolean> {
    return this.authService.getIsRefreshCalledListener().pipe(
      take(1),
      switchMap((isCalled) => {
        if (!isCalled) {
          return this.authService.refresh().pipe(
            take(1),
            switchMap(() => of(true)),
          );
        }
        return of(true);
      })
    );
  }
}

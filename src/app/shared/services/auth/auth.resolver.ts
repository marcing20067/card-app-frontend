import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver {
  constructor(private authService: AuthService) {}
  resolve() {
    return this.authService.getIsRefreshCalledListener().pipe(
      take(1),
      switchMap((isCalled) => {
        if (!isCalled) {
          return this.authService.refresh().pipe(
            take(1),
            switchMap(() => of(true))
          );
        }
        return of(true);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { FieldsState, FieldState } from './fieldState.model';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  private fieldsState$ = new BehaviorSubject<FieldsState>({});

  getFieldStateListener(inputId: string): Observable<FieldState> {
    return this.fieldsState$.asObservable().pipe(
      startWith({ [inputId]: { isFocus: false } }),
      switchMap((fState) => {
        const fieldState = fState[inputId];
        return of(fieldState);
      }),
      distinctUntilChanged()
    );
  }

  changeFieldState(changedFieldState: FieldsState) {
    this.fieldsState$.pipe(take(1)).subscribe((fState) => {
      this.fieldsState$.next({ ...fState, ...changedFieldState });
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Set } from '../shared/models/set.model';

@Injectable({
  providedIn: 'root',
})
export class SetsService {
  private sets$ = new BehaviorSubject<Set[]>([]);
  constructor(private http: HttpClient) {}

  getSet(id: string) {
    return this.http.get<Set>(environment.BACKEND_URL + 'sets/' + id);
  }

  getSets() {
    return this.http.get<Set[]>(environment.BACKEND_URL + 'sets');
  }

  deleteSet(id: string) {
    return this.http.delete(environment.BACKEND_URL + 'sets/' + id).pipe(
      tap(() => {
        this.sets$.subscribe((sets) => {
          const updatedSet = sets.filter((s) => s._id === id);
          this.sets$.next(updatedSet);
        });
      })
    );
  }

  addSet(set: Set) {
    return this.http.post(environment.BACKEND_URL + 'sets', set);
  }
}

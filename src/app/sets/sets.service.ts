import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Set } from '../shared/models/set.model';

@Injectable({
  providedIn: 'root',
})
export class SetsService {
  sets$ = new BehaviorSubject<Set[]>([]);
  constructor(private http: HttpClient) {}

  getSetsPanelData() {
    return this.http.get(environment.BACKEND_URL + 'sets', {
      params: {
        fields: 'cards'
      }
    })
  }

  getSet(id: string) {
    return this.http.get<Set>(environment.BACKEND_URL + 'sets/' + id);
  }

  deleteSet(id: string) {
    return this.http.delete(environment.BACKEND_URL + 'sets/' + id).pipe(
      tap(() => {
        this.sets$.pipe(take(1)).subscribe((sets) => {
          const updatedSet = sets.filter((s) => s._id === id);
          this.sets$.next(updatedSet);
        });
      })
    );
  }
}

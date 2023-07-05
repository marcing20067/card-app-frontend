import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Set } from '../shared/models/set/set.model';

@Injectable({
  providedIn: 'root',
})
export class SetsService {
  private page = 1;
  private sets$ = new BehaviorSubject<Set[]>([]);
  constructor(private http: HttpClient) {}

  getSet(id: string) {
    return this.http.get<Set>(environment.BACKEND_URL + 'sets/' + id);
  }

  getSetsListener() {
    return this.sets$.asObservable().pipe(
      map((sets) => {
        return sets.map((item) => {
          item.name = this.formatName(item.name);
          return item;
        });
      })
    );
  }

  private formatName(name: string) {
    let formattedName = (name[0].toUpperCase() + name.slice(1)).trim();
    if (formattedName.length > 9) {
      formattedName = formattedName.slice(0, 7) + '..';
    }
    return formattedName;
  }

  getSets(name?: string) {
    this.page = 1;
    return this.loadSets(name).pipe(tap((sets) => this.sets$.next(sets)));
  }

  loadMore(name?: string) {
    this.page++;
    return this.loadSets(name).pipe(
      tap((newSets) => {
        this.sets$
          .pipe(
            take(1),
            map((oldSets) => [...oldSets, ...newSets])
          )
          .subscribe((sets) => this.sets$.next(sets));
      })
    );
  }

  private loadSets(name = '') {
    return this.http.get<Set[]>(environment.BACKEND_URL + 'sets', {
      params: {
        name,
        page: this.page,
      },
    });
  }

  deleteSet(id: string) {
    return this.http.delete(environment.BACKEND_URL + 'sets/' + id).pipe(
      tap(() => {
        this.sets$.pipe(take(1)).subscribe((sets) => {
          const updatedSets = sets.filter((s) => s._id !== id);
          this.sets$.next(updatedSets);
        });
      })
    );
  }

  addSet(set: Set) {
    return this.http.post(environment.BACKEND_URL + 'sets', set);
  }

  editSet(set: Set) {
    return this.http.put(environment.BACKEND_URL + 'sets/' + set._id, set);
  }
}

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
    const nameWithFirstCapitalLetter = name[0].toUpperCase() + name.slice(1);
    let formattedName = nameWithFirstCapitalLetter.replace(/ /g, '');
    if (formattedName.length > 9) {
      formattedName = formattedName.slice(0, 7) + '..';
    }
    return formattedName;
  }

  getSets(name?: string) {
    this.page = 1;
    return this.http.get<Set[]>(environment.BACKEND_URL + 'sets').pipe(
      map((sets) => {
        if (name) {
          sets = sets.filter((s) => {
            const sName = s.name.replace(/ /g, '').toLowerCase();
            const sNameFilter = name.replace(/ /g, '').toLowerCase();
            return sName.includes(sNameFilter);
          });
        }
        return sets;
      }),
      tap((sets) => {
        this.sets$.next(sets);
      })
    );
  }

  loadMore() {
    this.page++;
    return this.http
      .get<Set[]>(environment.BACKEND_URL + 'sets', {
        params: {
          page: this.page,
        },
      })
      .pipe(
        tap((newSets) => {
          this.sets$.pipe(take(1)).subscribe((oldSets) => {
            const sets = [...oldSets, ...newSets];
            this.sets$.next(sets);
          });
        })
      );
  }

  deleteSet(id: string) {
    return this.http.delete(environment.BACKEND_URL + 'sets/' + id).pipe(
      tap(() => {
        this.sets$.pipe(take(1)).subscribe((sets) => {
          const updatedSet = sets.filter((s) => s._id !== id);
          this.sets$.next(updatedSet);
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

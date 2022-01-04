import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  FooterExtraFeaturesForRoute,
  NavExtraFeaturesForRoute,
} from '../shared/enums/layout.enums';
import { Path } from '../shared/types/path.type';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private urlChangeEvent$ = new Subject<{
    footer: FooterExtraFeaturesForRoute;
    nav: NavExtraFeaturesForRoute;
  }>();

  constructor(private location: Location) {
    this.location.onUrlChange((originalPath) => {
      if (originalPath === '/') {
        return;
      }

      const path = this.transformPath(originalPath) as Path;
      const extraFeatures = {
        nav: NavExtraFeaturesForRoute[path],
        footer: FooterExtraFeaturesForRoute[path]
      }

      this.urlChangeEvent$.next(extraFeatures);
    });
  }

  onUrlChange(enumType: 'nav' | 'footer') {
    return this.urlChangeEvent$.asObservable().pipe(
      switchMap((featuresData) => {
        console.log(featuresData);
        return of(featuresData[enumType]);
      })
    );
  }

  private transformPath(path: string) {
    const splitedPath = path.split('/');
    if (splitedPath.length > 3) {
      const transformedPath =
        splitedPath.slice(0, splitedPath.length - 1).join('/') + '/:param';
      return transformedPath;
    }
    return path;
  }
}

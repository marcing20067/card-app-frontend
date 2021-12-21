import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  FooterExtraFeaturesForRoute,
  NavExtraFeaturesForRoute,
} from '../shared/enums/layout.enums';
import { ActualRoute } from '../shared/types/actualRoute.type';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  urlChangeEvent$ = new Subject<
    FooterExtraFeaturesForRoute | NavExtraFeaturesForRoute
  >();

  constructor(private location: Location) {}

  getExtraFeatures(enumType: 'Nav' | 'Footer', path: ActualRoute) {
    return enumType === 'Nav'
      ? NavExtraFeaturesForRoute[path]
      : FooterExtraFeaturesForRoute[path];
  }

  transformPath(path: string) {
    const splitedPath = path.split('/');
    if (splitedPath.length > 3) {
      return (splitedPath.slice(0, splitedPath.length - 1).join('/') +
        '/:param') as ActualRoute;
    }
    return path as ActualRoute;
  }

  onUrlChange(enumType: 'Nav' | 'Footer') {
    this.location.onUrlChange((path) => {
      const actualRoute = this.transformPath(path);
      const extraFeatures = this.getExtraFeatures(enumType, actualRoute);
      this.urlChangeEvent$.next(extraFeatures);
    });
    return this.urlChangeEvent$.asObservable();
  }
}

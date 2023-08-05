import {
  FooterExtraFeaturesForRoute,
  NavExtraFeaturesForRoute,
} from './layout.enums';

export type Path =
  | keyof typeof NavExtraFeaturesForRoute
  | keyof typeof FooterExtraFeaturesForRoute;

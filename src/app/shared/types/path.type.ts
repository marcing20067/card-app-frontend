import { FooterExtraFeaturesForRoute, NavExtraFeaturesForRoute } from "../enums/layout.enums";

export type Path =
  | keyof typeof NavExtraFeaturesForRoute
  | keyof typeof FooterExtraFeaturesForRoute;
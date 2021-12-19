export enum NavExtraFeaturesForRoute {
  '/home' = '',
  '/auth/login' = 'banner',
  '/auth/activation/:id' = '',
  '/auth/signup' = 'banner desktop-no-bgc',
  '/sets' = '',
  '/sets/learn/:id' = '',
  '/sets/create' = '',
  '/sets/create/:id' = '',
  '/user' = '',
}

export enum FooterExtraFeaturesForRoute {
  '/home' = '',
  '/auth/login' = 'desktop-pill-items',
  '/auth/signup' = 'desktop-pill-items',
  '/sets' = 'creamy-bgc',
  '/sets/learn/:id' = 'creamy-bgc mobile-no-footer',
  '/sets/create' = 'creamy-bgc',
  '/sets/create/:id' = '',
  '/user' = 'creamy-bgc',
  '/auth/activation/:id' = 'creamy-bgc',
}

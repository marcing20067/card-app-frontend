import { Provider } from '@angular/core';

export const GLOBAL_ELEMENTS: Provider[] = [
  {
    provide: 'popup',
    useFactory: () => document.querySelector('app-popup'),
  },
  {
    provide: 'nav',
    useFactory: () => document.querySelector('nav'),
  },
];

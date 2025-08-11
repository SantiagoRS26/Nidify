import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeEs);
bootstrapApplication(App, {
  ...appConfig,
  providers: [...(appConfig.providers ?? []), { provide: LOCALE_ID, useValue: 'es-ES' }],
}).catch((err) => console.error(err));

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';

// Bootstrapping the app

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// Intentionally handling errors via .catch() on the returned promise
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideAnimations(), // injecting animation module
  ],
}).catch((err) => console.error(err));

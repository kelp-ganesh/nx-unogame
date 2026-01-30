import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { SocketIoConfig, provideSocketIo } from 'ngx-socket-io';
import Aura from '@primeuix/themes/aura';

const config: SocketIoConfig = {
  url: '',
  options: {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false,
    path: '/socket.io',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideSocketIo(config),
    MessageService,
    providePrimeNG({
       theme: {
        preset: Aura,
      },
    }),
  ],
};

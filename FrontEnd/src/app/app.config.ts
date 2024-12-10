import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxStripeModule } from 'ngx-stripe';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxStripeModule.forRoot('pk_test_51NvgHdSDfIeb5BiQvWELBZI17A3OGtFpId0gHWAhPMkOecpl2zUSOxwXHGolu2oslexl9EY7gDRrsP3Yxxlie9EO009ojdOmMw') 
    ),
  ]
};

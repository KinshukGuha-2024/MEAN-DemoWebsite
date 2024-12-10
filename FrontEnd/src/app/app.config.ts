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
      NgxStripeModule.forRoot('pk_test_51OXjtaBpy9aFtc5RSietSew4fg0PTbV1Z2Sb3IKpCfFLlXDenzpX6vkC2bCcZFxbo6qYtbxMlb4JWUkwKNYeQbec00xKO8mxWl') 
    ),
  ]
};

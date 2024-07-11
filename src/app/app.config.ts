import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),provideToastr(), provideAnimationsAsync(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '619580621696-evh90so3evttspdgna3go72qittoa8tn.apps.googleusercontent.com'//clientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1266524970999827')//clientId
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
    ]
};

 
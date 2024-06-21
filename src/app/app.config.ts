import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),provideToastr(), provideAnimationsAsync()
    // ,ReCaptchaV3Service, provideAnimationsAsync(),  {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('208682659786-5lge05qu21o1gu4euv1s9uv32nrj140k.apps.googleusercontent.com'),//Google-Client-ID-Goes-Here
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
    ]
};

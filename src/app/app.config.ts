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
    ]
};

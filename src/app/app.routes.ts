import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConnectionProfileComponent } from './components/connection-profile/connection-profile.component';
import { SearchUserProfileComponent } from './components/search-user-profile/search-user-profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { CallingComponent } from './components/calling/calling.component';
import { MessageComponent } from './components/message/message.component';
import { MailComponent } from './components/mail/mail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';
import { PaypalPaymentComponent } from './components/paypal-payment/paypal-payment.component';
import { LinkedinCallbackComponent } from './components/linkedin-callback/linkedin-callback.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SendchatmessageComponent } from './components/sendchatmessage/sendchatmessage.component';


export const routes: Routes = [
    { path: '', component: SignInComponent },
    { path: 'register', component: SignUpComponent },
    {
        path: 'dashboard/:id', component: ConnectionProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'searchUserProfile/:username', component: SearchUserProfileComponent,
        canActivate: [AuthGuard]
    },
    { path: 'chat', component: ChatComponent, },
    { path: 'calling/:id', component: CallingComponent, },
    {
        path: 'dashboard', component: HomeComponent,
       // canActivate: [AuthGuard]
    },
    { path: 'dashboard/call/user', component: CallingComponent, },
    { path: 'message/:id', component: MessageComponent },
    { path: 'mail', component: MailComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'payment-stripe', component: StripePaymentComponent },
    { path: 'payment-paypal', component: PaypalPaymentComponent },
    { path: 'notification', component: NotificationComponent },
    { path: 'chat/:userId', component: SendchatmessageComponent, },


];

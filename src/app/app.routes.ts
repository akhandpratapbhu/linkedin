import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConnectionProfileComponent } from './components/connection-profile/connection-profile.component';
import { SearchUserProfileComponent } from './components/search-user-profile/search-user-profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { CallingComponent } from './components/calling/calling.component';
import { HomeOrCallResolverService } from './services/home-or-call-resolver.service';
import { MessageComponent } from './components/message/message.component';


export const routes: Routes = [
    {path:'',component:SignInComponent},
    {path:'register',component:SignUpComponent},
   
    {path:'dashboard/:id',component:ConnectionProfileComponent, canActivate: [AuthGuard] },
    {path:'searchUserProfile/:username',component:SearchUserProfileComponent, canActivate: [AuthGuard] },
    {path:'chat',component:ChatComponent,},
    {path:'calling/:id',component:CallingComponent,},
 
    {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [AuthGuard]
        // resolve: { showHome: HomeOrCallResolverService}
      },
      {
        path: 'dashboard/call/user',
        component: CallingComponent,
          
      },
      {path:'message/:id',component:MessageComponent}
];

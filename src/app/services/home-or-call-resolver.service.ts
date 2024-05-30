import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class HomeOrCallResolverService {

  constructor(private authService: AuthService, private router: Router) {
    this.authService.ringingSubject.subscribe((val:boolean)=>{
     // if(val)       this.router.navigate(['dashboard/call/user']);

    })
  }

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
//     const shouldShowCall = this.authService.shouldShowCall(); // Implement your condition logic in AuthService
// console.log("shouldShowCall",shouldShowCall);

//     if (shouldShowCall) {
//       this.router.navigate(['dashboard/call/user']);
//       return false;
//     } else {
//       return true;
//     }
//   }
}

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { switchMap } from 'rxjs/operators';
// import { StripeService } from '@stripe/stripe-js';
// // import {loadStripe} from '@stripe/stripe-js';



// @Component({
//   selector: 'app-stripe-checkout',
//   standalone: true,
//   imports: [],
//   templateUrl: './stripe-checkout.component.html',
//   styleUrl: './stripe-checkout.component.css'
// })
// export class StripeCheckoutComponent {

//   constructor(private http: HttpClient, private stripeService: StripeService) {}

//   checkout() {
//     this.http.post('/create-checkout-session', {})
//       .pipe(
//         switchMap((session :any)=> {
//           console.log("session",session);
//           return session
//           //return this.stripeService.redirectToCheckout({ sessionId: session.});
//         })
//       )
//       // .subscribe(result => {
//       //   if (result.error) {
//       //     alert(result.error.message);
//       //   }
//       // });
//   }
// }

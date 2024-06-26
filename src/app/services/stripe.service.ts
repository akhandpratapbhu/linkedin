import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripe: Stripe | null = null;

  constructor(private http: HttpClient) {
    loadStripe('pk_test_51PVq7g00cRf59ySi2IqqCppVQCR5iEB9E2Qi0ia0cq90xLXCLSfo2OP7lp85tFymjs2HKYXGo0KmWJI5EDigrvMO00EFPtYNOH').then((stripe) => {
      this.stripe = stripe;
    });
  }

  async createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>('/api/stripe/create-payment-intent', { amount }).toPromise();
  }

  async handlePayment(clientSecret: string, cardElement: any) {
    if (this.stripe) {
      return this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
    }
    return null;
  }}

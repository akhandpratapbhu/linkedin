import { Component, OnInit, AfterViewInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, AfterViewInit{

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: any;
  clientSecret:any;
  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51PVq7g00cRf59ySi2IqqCppVQCR5iEB9E2Qi0ia0cq90xLXCLSfo2OP7lp85tFymjs2HKYXGo0KmWJI5EDigrvMO00EFPtYNOH');
  }

  async ngAfterViewInit() {
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    }
  }

  async handlePayment() {

      this.clientSecret  = await this.stripeService.createPaymentIntent(1000);
    const  paymentIntent  = await this.stripeService.handlePayment(this.clientSecret, this.cardElement);
    console.log('Payment successful:',paymentIntent);

    if (!paymentIntent) {
      console.error(paymentIntent);
    } else {
      console.log('Payment successful:', paymentIntent);
    }
  }
}

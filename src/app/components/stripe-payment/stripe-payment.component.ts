import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { Stripe } from '@fireflysemantics/angular-stripe-service/lib/types';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './stripe-payment.component.html',
  styleUrl: './stripe-payment.component.css'
})
export class StripePaymentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;
  token: any;
  stripe!: Stripe;
  loading = false;
  confirmation: any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error!: string;

  constructor(
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService
  ) {}

  ngAfterViewInit() {
    this.stripeService
      .setPublishableKey(
        'pk_test_51PVq7g00cRf59ySi2IqqCppVQCR5iEB9E2Qi0ia0cq90xLXCLSfo2OP7lp85tFymjs2HKYXGo0KmWJI5EDigrvMO00EFPtYNOH'
      )
      .then((stripe) => {
        this.stripe = stripe;
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange( error: { message: string ; } ) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = '';
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Error:', error);
    } else {
      this.token = token;
      console.log('Success!', token);
    }
  }
}

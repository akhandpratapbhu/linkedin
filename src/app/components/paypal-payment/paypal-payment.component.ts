import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-paypal-payment',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxPayPalModule],
  templateUrl: './paypal-payment.component.html',
  styleUrl: './paypal-payment.component.css'
})
export class PaypalPaymentComponent {
  public payPalConfig?: IPayPalConfig;
  selectedQuantity:any
  purchaseItems = [
    { name: 'Waterproof Mobile Phone', quantity: 2, price: 150 },
    { name: 'Smartphone Dual Camera', quantity: 3, price: 50 },
    { name: 'Black Colour Smartphone', quantity: 1, price: 100 }
  ]
  total!: string;

  ngOnInit(): void {
    this.initConfig();
  }
  onQuantityChange(event: any) {
    this.selectedQuantity = event.target.value;
    const x=this.purchaseItems.map(x=>x.quantity= this.selectedQuantity)
    // Additional logic can be added here
  }
  private initConfig(): void {
    this.total = this.purchaseItems.map(x => x.quantity * x.price).reduce((a, b) => a + b, 0).toString();
    const currency = 'USD';

    this.payPalConfig = {
      currency: currency,
       clientId: 'AY_mUptgPGV-ozPdwl-vfV9ZSsukh92-UBCM09xKmaESeY-veR1meFNAVudsDlOJq5635txOCWqsQXnK',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: this.total,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: this.total
                }
              }
            },
            items: this.purchaseItems.map(x => <ITransactionItem>
              {
                name: x.name,
                quantity: x.quantity.toString(),
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: currency,
                  value: x.price.toString(),
                },
              })
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
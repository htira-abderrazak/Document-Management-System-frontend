import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { StripeService } from '../stripe.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { DirectorysericeService } from '../../repository/directoryserice.service';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  paymentHandler: any = null;

  private stripeAPIKey = `${environment.STRIPE_KEY}`;

  constructor(
    private service: StripeService,
    private route: Router,
    private local: LocalStorageService,
    private folderService: DirectorysericeService
  ) {}
  ngOnInit() {
    this.invokeStripe();
  }
  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: (stripeToken: any) => {
        this.service.payment(stripeToken.id, amount).subscribe({
          next: (res: any) => {
            this.folderService.getTotalSize().subscribe({
              next: (res: any) => {
                this.local.set('max-size', res.max_size / 1024 / 1024);
                this.route.navigate(['/storage']);
              },
            });
          },
          error: (error: any) => {
            alert('error!');
          },
        });
      },
    });

    paymentHandler.open({
      name: 'ItSolutionStuff.com',
      description: '3 widgets',
      amount: amount * 100,
    });
  }
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');

      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            alert('Payment has been successfull!');
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }
}

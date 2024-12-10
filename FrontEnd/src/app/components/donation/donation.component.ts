import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from '../page_utilities/header/header.component';
import { FooterComponent } from '../page_utilities/footer/footer.component';
import { SidebarComponent } from '../page_utilities/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { config } from '../../../config';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule, StripeService, StripeCardComponent  } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, HttpClientModule, FormsModule, NgxStripeModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent {
  @ViewChild(StripeCardComponent) stripeCard!: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#5e72e4',  
        color: '#1a1a1a',  
        fontWeight: '600',
        fontFamily: 'Poppins, Arial, sans-serif',  
        fontSize: '18px',  
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#f4e1a1',  
        },
        '::placeholder': {
          color: '#a1b2d2',  
        },
        padding: '10px 14px',  
        backgroundColor: '#f8f8f8', 
      },
      invalid: {
        iconColor: '#ff5f57',  
        color: '#ff5f57',  
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  activeTab: string = 'one-time';
  donationData = {
    firstName: '',
    lastName: '',
    email: '',
    amount: 0,
  };
  predefinedAmounts: number[] = [15, 25, 50];
  customAmount: number | null = null;
  card: any;
  showLoader: boolean = false;
  showPay: boolean = true;
  constructor(private stripeService: StripeService, private http: HttpClient, private router: Router) {}



  // Method to set the active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getIndicatorPosition(): string {
    switch (this.activeTab) {
      case 'one-time':
        return '2px';
      case 'monthly':
        return 'calc(33.33% + 2px)';
      case 'annually':
        return 'calc(66.66% + 2px)';
      default:
        return '2px';
    }
  }

  // Called when a custom amount is entered
  updateCustomAmount() {
    if (this.customAmount && this.customAmount > 0) {
      this.clearPredefinedSelection(); // Clear predefined selection
      this.donationData.amount = this.customAmount;
    }
  }

  // Called when a predefined amount is selected
  setActiveClass(amount: number) {
    this.donationData.amount = amount;
    this.customAmount = null; 
  }

  // Clears predefined amounts selection
  clearPredefinedSelection() {
    this.donationData.amount = 0;
  }

  // Clears custom amount input
  clearField() {
    this.customAmount = null;
  }

  // Form submission logic
  onSubmit() {
    if (!this.stripeCard) {
      console.error('Stripe Card Component is not initialized.');
      alert('Please wait until the card element is fully loaded.');
      return;
    }
    console.log('amount',this.donationData.amount)
    this.showPay = false;
    this.showLoader = true;
    if (this.donationData.amount > 0) {
      this.http.post<any>(`${config.apiUrl}create-payment-intent`, {
        amount: this.donationData.amount,
        firstName: this.donationData.firstName,
        lastName: this.donationData.lastName,
        email: this.donationData.email,
        recur_type: this.activeTab,
      }).subscribe(
        (response) => {
          const { clientSecret } = response;

          // Confirm card payment
          this.stripeService.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.stripeCard.element, 
              billing_details: {
                name: `${this.donationData.firstName} ${this.donationData.lastName}`,
                email: this.donationData.email,
              },
            },
          }).subscribe(
            (result) => {
              if (result.error) {
                console.error('Payment Confirmation Error:', result.error);
                alert(result.error.message);
              } else if (result.paymentIntent?.status === 'succeeded') {
                this.router.navigate(['/donation/success']);
              }
            },
            (error) => {
              console.error('Error confirming payment:', error);
              alert('Something went wrong during payment confirmation. Please try again.');
            }
          );
        },
        (error) => {
          console.error('Error creating payment intent:', error);
          alert('Something went wrong while processing your payment. Please try again.');
        }
      );
    } else {
      alert('Please enter a valid donation amount.');
    }
  }  
}

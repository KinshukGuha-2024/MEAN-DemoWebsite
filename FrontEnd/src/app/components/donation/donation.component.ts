import { Component } from '@angular/core';
import { HeaderComponent } from '../page_utilities/header/header.component';
import { FooterComponent } from '../page_utilities/footer/footer.component';
import { SidebarComponent } from '../page_utilities/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { config } from '../../../config';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, StripeIdealBankElementOptions } from '@stripe/stripe-js';


@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HeaderComponent, FooterComponent, SidebarComponent, HttpClientModule, FormsModule, NgxStripeModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent {
  activeTab: string = 'one-time'; // Default active tab
  donationData = {
    firstName: '',
    lastName: '',
    email: '',
    amount: 0,
  };
  predefinedAmounts: number[] = [15, 25, 50];
  customAmount: number | null = null;

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
    this.customAmount = null; // Clear custom input
  }

  // Clears predefined amounts selection
  clearPredefinedSelection() {
    this.donationData.amount = 0; // Reset donation amount
  }
  clearField() {
    this.customAmount = null
  }

  // Form submission logic
  onSubmit() {
    if (this.donationData.amount) {
      console.log('Donation Submitted:', this.donationData);
      alert(`Thank you for your donation of $${this.donationData.amount}!`);
    } else {
      alert('Please select or enter a donation amount.');
    }
  }

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
}
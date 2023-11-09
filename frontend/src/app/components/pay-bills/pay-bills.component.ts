import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-pay-bills',
  templateUrl: './pay-bills.component.html',
  styleUrls: ['./pay-bills.component.scss']
})

export class PayBillsComponent {
  isLoading: boolean = false;
  paymentOptions: any = [];
  selectedPaymentOption: number;
  userIdentifier: string;
  noAccountFound: boolean = true;
  accountOptions: any = [];
  selectedAccount: number;
  accounts : Account[];
  amount: number;
  constructor(private authService: AuthService, private notificationService: NotificationService,
    private userService: UserService,private confirmationService: ConfirmationService,
    private accountService: AccountService){}

  ngOnInit(){
    this.userIdentifier = localStorage.getItem('userIdentifier');
    this.getPaymentOptions();
    this.getAccounts();
  }


  getPaymentOptions(){
    this.paymentOptions = [
      {name: 'Electricity Bill', value: 1},
      {name: 'Gas Bill', value: 2},
      {name: 'Water Bill', value: 3},
      {name: 'Mobile Recharge', value: 4},
      {name: 'Wifi Recharge', value:5}
  ];
  }

  getAccounts(){
    this.isLoading = true; 
    this.accountService.getAccountsById(this.userIdentifier).subscribe({
      next:(response) => {
        this.isLoading = false;
        this.accounts = response;
        this.checkTotalAccounts();
      }, error:(error) =>{
        this.isLoading = false;
        if (error.status == 422) {
          this.notificationService.showMessage('error', true, `${error.error}`, '');
        } else {
          this.notificationService.showMessage('error', true, `${error.status}
      - ${error.statusTeaxt} - ${error.error}`, '');
        }      
      }
    })
  }
// check total accounts of user abd bind select account dropdown if multipe accounts
  checkTotalAccounts(){
    if(this.accounts?.length > 0){
      this.noAccountFound = false;
      this.accountOptions = [];
      this.accounts.forEach(x => {
        this.accountOptions.push({
          label: 'Account Number: *****' + x.accountNumber.toString().slice(-4),
          value: x.accountId
        });
        if (x.accountNumber) {
          x.maskAccountNumber = "*****" + x.accountNumber.toString().slice(-4);
        }
      });
      this.selectedAccount = this.accountOptions[0].value;
  }
  }
  
  makePayment(){
    if(!this.selectedAccount){
      this.notificationService.showMessage('error', true, `You have added multiple accounts. Please select an account to pay bills.`, '');
      return;
    }
    if(!this.selectedPaymentOption){
      this.notificationService.showMessage('error', true, `Please select a bill option for payment.`, '');
      return;
    }

    if(!this.amount || (this.amount && this.amount <= 0)){
      this.notificationService.showMessage('error', true, `Please add amount for payment`, '');
      return;
    }

      this.confirmationService.confirm({
          message: 'Are you sure that you want to perform this payment?',
          accept: () => {
            this.isLoading = true; 
            this.accountService.makePayment(this.amount,this.selectedAccount).subscribe({
              next:(response) => {
                this.isLoading = false;
                this.selectedAccount = null;
                this.selectedPaymentOption = null;
                this.amount = null;
                this.notificationService.showMessage('success', true, `Payment completed successfully.`, '');
              }, error:(error) =>{
                this.isLoading = false;
                if (error.status == 422) {
                  this.notificationService.showMessage('error', true, `${error.error}`, '');
                } else {
                  this.notificationService.showMessage('error', true, `${error.status}
              - ${error.statusTeaxt} - ${error.error}`, '');
                }      
              }
            })
         }
      });
  }
}

import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
@Injectable()
export class DashboardComponent implements OnInit {
  
  //transactions table variables
  dataSource = [];
  columnsToDisplayEng = ['debit/credit', 'amount', 'date'];
  expandedElement: Transaction | null;
  
  isLoading = false;
  isTransactionsLoading = false;
  userIsAuthenticated = false;
  hasTransactions = false; // if there are no transactions for logged user, set a flag for front-end
  userIdentifier: string;
  user: User;
  noAccountFound: boolean = true;
  accounts : Account[];
  accountDetails: Account;
  accountOptions: any = [];
  selectedAccount: number;
  transactionsList: Transaction[] = [];
  usedToday: number = 0;
  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private router: Router,
    private accountService: AccountService,
    private notificationService: NotificationService){}
  
  ngOnInit() {
    this.isLoading = true;
    this.userIdentifier = this.authService.getUserIdentifier();
    this.getUser();
    this.getAccounts();
  }
// get user data by id
  getUser(){
    this.isLoading = true; 
    this.userService.getUserById(this.userIdentifier).subscribe({
      next:(response) => {
        this.isLoading = false;
        this.user = response;
      }, error:(error) =>{
        this.isLoading = false;
        if (error.status == 422) {
          this.notificationService.showMessage('error', true, `${error.error}`, '');
        } else {
          this.notificationService.showMessage('error', true, `${error.status}
      - ${error.statusText} - ${error.error}`, '');
        }      
      }
    })
  
  }
  // navigate to support
  moveToSupport(){
    this.router.navigate(['/help-support']);
  }
  // get account by id
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
      this.accountDetails = this.accounts[0];  
      this.selectedAccount = this.accountOptions[0].value;
      this.getTransactions();
  }
  }
// get recent transaction by account id
  getTransactions(){
    this.isTransactionsLoading = true;
    this.hasTransactions = false;
    this.accountDetails = this.accounts.find(x => x.accountId == this.selectedAccount); 
    this.accountService.getRecentTransactionsByAccountId(this.selectedAccount).subscribe({
      next:(response) => {
        this.isTransactionsLoading = false;
        this.transactionsList = response;
        if(this.transactionsList.length > 0){
          this.hasTransactions = true;
          this.usedToday = 0;
          let startDate, endDate, today = new Date();
          startDate = today.setHours(0, 0, 0);
          endDate = today.setHours(23, 59, 59);
          let todaysTransaction = this.transactionsList.filter(x => new Date(x.transactionDate) >= startDate && 
          new Date(x.transactionDate) <= endDate && x.senderAccountId == x.accountId);
          if(todaysTransaction && todaysTransaction.length > 0){
            this.usedToday = todaysTransaction.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.amount;
            }, 0);
          }
        }
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
  
  calculateUsedToday(){
    
  }

// navigate to account
  moveToAccount(){
    this.router.navigate([`/my-account`]);
  }
  // navigate to transfers
  routeToTransfers(){
    this.router.navigate([`/transfers`]);
  }
  // navigate to pay-bills
  routeToPayBills(){
    this.router.navigate([`/pay-bills`]);
  }
}




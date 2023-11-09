import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction, TransactionExport } from 'src/app/models/transaction';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  isLoading = false;
  userIdentifier: string;
  accounts: Account[] = [];
  noAccountFound: boolean = true;
  accountOptions: any = [];
  selectedAccount: number;
  transactionsList: Transaction[] = [];
  filterTransactionsList: Transaction[] = [];
  listoftimerange : any =[];
  selectedtimerange:number=0;
  selectedrangedates: any;
  displayDateRangeTextbox: boolean = false;
  verifyUserDialog: boolean = false;
  enteredPasswordForVerification: string;
  hidePassword: boolean = true;
  cols = [
    { field: 'debitcredit', header: 'Debits/Credits' },
    { field: 'amountString', header: 'Amount' },
    { field: "currentBalance", header: 'Current Balance' },
    { field: 'paymentMethodType', header: 'Payment Mode' },
    { field: 'dateString', header: 'Transaction Date ' },
    { field: 'receiverName', header: 'Receiver Name ' },
    { field: "receiverAccountNumber", header: 'Send To Account' },
    { field: 'senderAccountNumber', header: 'Received From Account' }
  ];
  constructor(private authService: AuthService, private notificationService: NotificationService,private router: Router,
    private userService:UserService,  private accountService: AccountService ) {
     }

     ngOnInit(){
      this.userIdentifier = localStorage.getItem('userIdentifier');
      this.getAccounts();
      this.fillDrpFilter();
    }
// get account by userid
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
            label: 'Account Number:  *****' + x.accountNumber.toString().slice(-4),
            value: x.accountId
          });
          if (x.accountNumber) {
            x.maskAccountNumber = "*****" + x.accountNumber.toString().slice(-4);
          }
          x.maskCurrentBalance = true;
        });  
        this.selectedAccount = this.accountOptions[0].value;
        this.getTransactions();
    }
    }

    // get transaction by accountid
    getTransactions(){
      this.isLoading = true; 
      this.accountService.getTransactionsByAccountId(this.selectedAccount).subscribe({
        next:(response) => {
          this.isLoading = false;
          this.transactionsList = response;
          this.filterTransactionsList = response;
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
    // add time range dropdown values
    fillDrpFilter(){
      this.listoftimerange= [
        {drpKey: 1, drpValue: 'Last Month'},
        {drpKey: 2, drpValue: 'Last Week'}, // done
        {drpKey: 3, drpValue: 'Past 60 Days'}, // done
        {drpKey: 4, drpValue: 'This Month'},//done
        {drpKey: 6, drpValue: 'This Week'}, //donw
        {drpKey: 5, drpValue: 'Today'}, //done
        {drpKey: 7, drpValue: 'Yesterday'}, //done
        {drpKey:9, drpValue: 'Year to Date'},
        {drpKey:8, drpValue: 'Custom Range'}
      ];
    }
    // on change of time range perform below action
    typeChange(){
      const today = new Date(); // Current date
  let startDate;
  let endDate;

  if(this.selectedtimerange > 0){
    switch (this.selectedtimerange) {
      case 1: // Last Month
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 2: // Last Week
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        endDate = today;
        break;
      case 3: // Past 60 Days
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60);
        endDate = today;
        break;
      case 4: // This Month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case 5: // Today
        startDate = today;
        endDate = today;
        break;
      case 6: // This Week
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        endDate = today;
        break;
      case 7: // Yesterday
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        break;
      case 8: // Custom Range
       this.displayDateRangeTextbox = true;
        break;
      case 9: // Year to date
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;         
        break;
      default:
        this.filterTransactionsList = this.transactionsList;
        break;
    }
       // Filter the dateArray based on the calculated start and end dates
    if(this.selectedtimerange != 8){
      this.selectedrangedates = null;
      this.displayDateRangeTextbox = false;
      startDate = startDate.setHours(0, 0, 0);
      endDate = endDate.setHours(23, 59, 59);
      this.filterTransactionsList = this.transactionsList.filter(x => new Date(x.transactionDate) >= startDate && new Date(x.transactionDate) <= endDate);
    }
  }else{
    this.filterTransactionsList = this.transactionsList;
    this.selectedrangedates = null;
    this.displayDateRangeTextbox = false;
  }
 
}
// get transaction based on date range
getTransactionWithDateRange(){
  if(this.selectedrangedates !== null && this.selectedrangedates[0] != null && this.selectedrangedates[1] != null)
  {
    let startDate = new Date(this.selectedrangedates[0]);
    let endDate = new Date(this.selectedrangedates[1]);
    this.filterTransactionsList = this.transactionsList.filter(x => new Date(x.transactionDate) >= startDate && new Date(x.transactionDate) <= endDate);
  }
}
// authenticate user if user click on download statement button
verifyUser(){
  if(this.enteredPasswordForVerification){
    this.isLoading = true; 
    let user: User = new User();
    user.userIdentifier = this.userIdentifier;
    user.password = this.enteredPasswordForVerification;
    this.userService.verifyUser(user).subscribe({
      next:(response) => {
        if(response){
          this.exportCSV();
          this.verifyUserDialog = false;
        }else{
          this.notificationService.showMessage('error', true, `Wrong password. Try Again`, '');
        }
        this.isLoading = false;
        this.enteredPasswordForVerification = null;
      }, error:(error) =>{
        this.isLoading = false;
        this.enteredPasswordForVerification = null;
        this.verifyUserDialog = false;
        if (error.status == 422) {
          this.notificationService.showMessage('error', true, `${error.error}`, '');
        } else {
          this.notificationService.showMessage('error', true, `${error.status}
      - ${error.statusTeaxt} - ${error.error}`, '');
        }      
      }
    })
  }else{
    this.notificationService.showMessage('error', true, `Please enter password to downlaod your statements`, '');
  }
}
// export to csv
exportCSV() {
  let dataToExport: TransactionExport[]
  const headers = this.cols.map(col => col.header);
  dataToExport = this.filterTransactionsList.map(transaction => {
    let dateObj = new Date(transaction.transactionDate);
    let dateNumber = dateObj.getDate();
    let monthNumber = dateObj.getMonth();
    let yearNumber = dateObj.getFullYear();
    const exportRow: TransactionExport = {
      debitcredit:  transaction.senderAccountId == transaction.accountId ? 'Debit' : 'Credit',
      amountString: (transaction.senderAccountId == transaction.accountId ? '-' : '+') + transaction.amount,
      currentBalance: transaction.currentBalance,
      paymentMethodType: transaction.senderAccountId == transaction.accountId ? transaction.paymentMethodType : '',
      dateString:  (dateNumber < 10 ? '0' : '') + dateNumber +  (monthNumber < 9 ? '-0' : '-') + (monthNumber +1) + '-'+ yearNumber,
      receiverName: transaction.senderAccountId == transaction.accountId  && transaction.receiverAccountId != transaction.accountId  ? transaction.receiverName : null,
      senderAccountNumber: transaction.senderAccountId == transaction.accountId  && transaction.receiverAccountId != transaction.accountId ? transaction.receiverAccountNumber : null,
      receiverAccountNumber: transaction.receiverAccountId == transaction.accountId && transaction.senderAccountId != transaction.accountId ? transaction.senderAccountNumber : null
    };
    return exportRow;
  });

  const csvContent = this.generateCSVContent(headers, dataToExport);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'Bank-Statements.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// generate csv
generateCSVContent(headers, data) {
  const headerRow = headers.map(header => this.escapeCSVValue(header)).join(',');
  const dataRows = data.map(row => {
    const values = this.cols.map(col => {
      const field = col.field;
      let value = row[field] || '';
      return this.escapeCSVValue(value);
    });
    return values.join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}
escapeCSVValue(value) {
  if (typeof value === 'string' && value.includes(',')) {
    return `"${value}"`;
  }
  return value;
}
// hide show password
togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}
cancelExport(){
  this.verifyUserDialog = false;
  this.enteredPasswordForVerification = null;
}
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AccountType, AccountTypeOption } from 'src/app/shared/enums/accountType';
import { NotificationService } from 'src/app/shared/notification.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  isLoading = false;
  userIdentifier: string;
  accounts: Account[] = [];
  accountDetails : Account;
  noAccountFound: boolean = true;
  accountAddForm: FormGroup;
  accountUpdateForm: FormGroup;
  message: string;
  error: boolean = false;
  showForm: boolean = false;
  editDialog: boolean = false;
  hideAmount: boolean = true;
  isRedirectedFromDashboard:boolean = false;
  editAccount: Account = new Account();
  accountTypeOptions: any= [];
  public accountType: typeof AccountType;
  constructor(private authService: AuthService, private notificationService: NotificationService,private router: Router,
    private userService:UserService, private fb: FormBuilder, private accountService: AccountService ) {
      this.accountDetails = new Account();
      this.accountType = AccountType;
      if(this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state) this.isRedirectedFromDashboard = this.router.getCurrentNavigation().extras.state.isFromDashboard;
     }
  ngOnInit(){
    this.fillAccountType();
  this.userIdentifier = localStorage.getItem('userIdentifier');
  this.getAccounts();
  this.createForm();
  if (this.isRedirectedFromDashboard) {
    this.showForm = true;
  }
}
// get accounts by userid
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
    this.accounts.forEach(x => {
      if (x.accountNumber) {
        x.maskAccountNumber = "*****" + x.accountNumber.toString().slice(-4);
      }
      x.maskCurrentBalance = true;
    });  
    this.accountDetails.accountHolderName = this.accounts[0].accountHolderName;
}
}

createForm(){
  this.accountAddForm = this.fb.group({
    accountHolderName: [this.accountDetails.accountHolderName, [Validators.required, Validators.minLength(3) ]],
    accountNumber: [this.accountDetails.accountNumber, [Validators.required]],
    bsb: [this.accountDetails.bsbNumber, [Validators.required]],
    accountType: [this.accountDetails.accountType, [Validators.required]]
  });
  this.accountUpdateForm = this.fb.group({
    accountHolderName: [this.accountDetails.accountHolderName, [Validators.required, Validators.minLength(3) ]],
    accountNumber: [this.accountDetails.accountNumber, [Validators.required]],
    bsb: [this.accountDetails.bsbNumber, [Validators.required]],
    accountType: [this.accountDetails.accountType, [Validators.required]]
  });
}
AddAccount(){
  if (!this.accountAddForm.valid) {
    Utils.validateAllFormFields(this.accountAddForm);
    return;
  }
  this.accountDetails.userIdentifier = this.userIdentifier;
  this.isLoading = true; 
  this.accountService.addAccount(this.accountDetails).subscribe({
    next:(response) => {
      this.isLoading = false;
      this.accountDetails = response;
      this.notificationService.showMessage('success', true, `Account added successfully`, '');
      this.showForm = false;
      this.accounts.push(this.accountDetails);
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

cancelAddingAccount(){
  this.showForm = false;
  this.createForm();
}

toggleAmountVisibility(account){
    account.maskCurrentBalance = !account.maskCurrentBalance;
}
toggleAccountVisibility(account){
    if(account.maskAccountNumber.includes('*')){
      account.maskAccountNumber = account.accountNumber.toString();
    }else{
      account.maskAccountNumber = "*****" + account.accountNumber.toString().slice(-4);
    }
}
updateAccount(){
  if (!this.accountUpdateForm.valid) {
    Utils.validateAllFormFields(this.accountUpdateForm);
    return;
  }
  this.isLoading = true; 
  this.accountService.updateAccount(this.editAccount).subscribe({
    next:(response) => {
      this.isLoading = false;
      this.editAccount = response;
      let index = this.accounts.findIndex(x => x.accountId == this.editAccount.accountId);
      if(index != -1){
        this.accounts[index] = this.editAccount;
      }
      this.checkTotalAccounts();
      this.notificationService.showMessage('success', true, `Account updated successfully`, '');
      this.editDialog = false;
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
openEditDialog(account){
  this.editAccount = account;
  this.editDialog = true;
}
fillAccountType() {
  this.accountTypeOptions = [];
  AccountTypeOption.forEach((label, value) => {
        this.accountTypeOptions.push({ label: label, value: value });
  });
}
getAccountType(type: number){
  return AccountTypeOption.get(type);
 }

}

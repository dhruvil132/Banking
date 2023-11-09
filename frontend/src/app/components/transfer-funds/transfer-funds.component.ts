import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-transfer-funds',
  templateUrl: './transfer-funds.component.html',
  styleUrls: ['./transfer-funds.component.scss']
})
export class TransferFundsComponent {
  isLoading: boolean = false;
  paymentOptions: any = [];
  selectedPaymentOption: string;
  userIdentifier: string;
  transferForm: FormGroup;
  transfer : Transaction = new Transaction();
  message: string;
  error: boolean = false;
  noAccountFound: boolean = true;
  sendTransaction: boolean = false;
  accountOptions: any = [];
  transferOptions: any = [];
  payWayOptions: any = [];
  selectedAccount: number;
  selectedTransferAccount: number;
  selectedPay: number;
  accounts : Account[];
  transactionList: Transaction[];
  showAccounts: boolean = false;
  showPhoneNumber: boolean = false;
  constructor(private authService: AuthService, private notificationService: NotificationService,
    private userService: UserService, public fb: FormBuilder,private confirmationService: ConfirmationService,
    private accountService: AccountService){}

    ngOnInit(){
      this.userIdentifier = localStorage.getItem('userIdentifier');
      this.createForm();
      this.getAccounts();
      this.fillPayOptions();
    }

    createForm(){
      this.transferForm = this.fb.group({
        receiverName: [this.transfer.receiverName, [Validators.required, Validators.minLength(3) ]],
        receiverAccountNumber: [this.transfer.receiverAccountNumber],

        bsb: [this.transfer.bsbNumber],
        amount: [this.transfer.amount],
        cellPhone:[this.transfer.cellPhone],
        selectPaymentWay :[this.selectedPay, [Validators.required]]
      });
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
            label: 'Account Number: *****' + x.accountNumber.toString().slice(-4),
            value: x.accountId
          });
          if (x.accountNumber) {
            x.maskAccountNumber = "*****" + x.accountNumber.toString().slice(-4);
          }
        });
        this.selectedAccount = this.accountOptions[0].value;
        this.getTransactions();
    }
    }
    // add pay options
    fillPayOptions(){
      this.payWayOptions = [];
      this.payWayOptions.push({label:'Please Select', value: null})
      this.payWayOptions.push({
            label: 'Phone number',
            value: 1
      });
      this.payWayOptions.push({
        label: 'Account',
        value: 2
  });
    }
// get all send transaction by account id
    getTransactions(){
      this.isLoading = true; 
      this.accountService.getAllSendTransactionsByAccountId(this.selectedAccount).subscribe({
        next:(response) => {
          this.isLoading = false;
          this.transactionList = response;
          if(this.transactionList?.length > 0){
            this.transactionList = this.filterUniqueByReceiverAccountNumber(this.transactionList);
            this.sendTransaction = true;
            this.transferOptions = [];
            this.transferOptions.push({label:'Please Select', value: null})
            this.transactionList.forEach(x => {
                this.transferOptions.push({
                  label: x.receiverName + ' - Account Number: *****' + x.receiverAccountNumber.toString().slice(-4),
                  value: x.transactionId
                });
            });
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
    // get names of receiver which are already send by user
    filterUniqueByReceiverAccountNumber(transactions: Transaction[]) {
      const uniqueTransactions: Transaction[] = [];
      const receiverNamesSet = new Set<number>();
  
      for (const transaction of transactions) {
        if (!receiverNamesSet.has(transaction.receiverAccountNumber)) {
          receiverNamesSet.add(transaction.receiverAccountNumber);
          uniqueTransactions.push(transaction);
        }
      }
  
      return uniqueTransactions;
    }
    // transfer funds 
    send(){
      if(!this.selectedAccount){
        this.notificationService.showMessage('error', true, `You have added multiple accounts. Please select an account to transfer funds.`, '');
        return;
      }
      if(!this.selectedPay){
        this.notificationService.showMessage('error', true, `Please select a way to transfer.`, '');
        return;
      }
      if (!this.transferForm.valid) {
        Utils.validateAllFormFields(this.transferForm);
        return;
      }
      let accountNumber = this.accounts.find(x => x.accountId == this.selectedAccount)?.accountNumber;
      if(this.transfer.receiverAccountNumber == accountNumber){
        this.error = true;
        this.message='You cannot send money to yourself.';
        return;
      }
      this.error = false;
      this.transfer.accountId = this.selectedAccount;
      this.transfer.senderAccountId = this.selectedAccount;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this transfer?',
            accept: () => {
              this.isLoading = true; 
              this.accountService.trasferFunds(this.transfer).subscribe({
                next:(response) => {
                  this.isLoading = false;
                  this.createForm();
                  this.selectedTransferAccount = null;
                  this.selectedPay = null;
                  this.transfer = new Transaction();
                  this.notificationService.showMessage('success', true, `Transfer of funds completed successfully.`, '');
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
    // set transfer related values
    setSelectedTransfer(){
     let selectedTransferAccount = this.transactionList.find(x => x.transactionId == this.selectedTransferAccount);
     this.showAccounts = true;
      this.transfer = new Transaction();
      this.transfer.accountId = this.selectedAccount;
      this.transfer.bsbNumber = selectedTransferAccount.bsbNumber;
     this.transfer.receiverAccountId = selectedTransferAccount.receiverAccountId;
     this.transfer.receiverAccountNumber = Number(selectedTransferAccount.receiverAccountNumber);
     this.transfer.receiverName = selectedTransferAccount.receiverName;
     this.transfer.senderAccountId  = this.selectedAccount;
     this.selectedPay = 2;
    }
    // cancel transfer
    cancelTransfer(){
      this.createForm();
      this.selectedTransferAccount = null;
      this.transfer = new Transaction();
    }
    onAccountChange(){
      this.getTransactions();
      this.selectedTransferAccount = null;
      this.transfer = new Transaction();
    }
    // transfer on phone number or account number
    hideShowPay(){
      this.showAccounts = false;
      this.showPhoneNumber = false;
      if(this.selectedPay == 1){
        this.showAccounts = false;
        this.showPhoneNumber = true;
        this.transfer.bsbNumber = '';
        this.transfer.receiverAccountNumber = 0;
        this.transferForm.controls.receiverAccountNumber.setValidators([]);
        this.transferForm.controls.bsb.setValidators([]);
        this.transferForm.controls.cellPhone.setValidators([Validators.required]);
        this.transferForm.controls.receiverAccountNumber.updateValueAndValidity();
        this.transferForm.controls.bsb.updateValueAndValidity();
        this.transferForm.controls.cellPhone.updateValueAndValidity();
       }
           if(this.selectedPay == 2){
            this.showAccounts = true;
            this.showPhoneNumber = false;
            this.transfer.cellPhone = null;
            this.transferForm.controls.receiverAccountNumber.setValidators([Validators.required]);
            this.transferForm.controls.bsb.setValidators([Validators.required]);
            this.transferForm.controls.cellPhone.setValidators([]);
            this.transferForm.controls.receiverAccountNumber.updateValueAndValidity();
            this.transferForm.controls.bsb.updateValueAndValidity();
            this.transferForm.controls.cellPhone.updateValueAndValidity();
           }
    }
}

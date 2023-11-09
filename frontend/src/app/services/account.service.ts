import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

    constructor(private http: HttpClient) { }

    public addAccount(account: Account): Observable<Account> {
        return this.http.post<Account>(environment.server + 'api/account/addAccount', account);
      }
    
      public getAccountsById(userIdentifier: string): Observable<Account[]> {
        return this.http.get<Account[]>(environment.server + `api/account/getAccountsById/${userIdentifier}`);
      }

      public getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(environment.server + `api/account/getTransactionsByAccountId/${accountId}`);
      }

      public getRecentTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(environment.server + `api/account/getRecentTransactionsByAccountId/${accountId}`);
      }

      public getAccountByAccountId(accountId: number): Observable<Account> {
        return this.http.get<Account>(environment.server + `api/account/getAccountByAccountId/${accountId}`);
      }

      public updateAccount(account: Account): Observable<Account> {
        return this.http.post<Account>(environment.server + `api/account/updateAccount`, account);
      }

      public trasferFunds(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(environment.server + `api/account/trasferFunds`, transaction);
      }

      public getAllSendTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(environment.server + `api/account/getAllSendTransactionsByAccountId/${accountId}`);
      }

      public makePayment(amount: number,accountId: number): Observable<Transaction> {
        return this.http.post<Transaction>(environment.server + `api/account/makePayment/${accountId}`, amount);
      }
}

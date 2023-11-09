import { AccountType } from "../shared/enums/accountType";

export class Account  {
    public accountId: number;
    public bsbNumber: string = "";  
    public accountHolderName: string = "";  
    public accountNumber : number;
    public currentBalance : number;
    public accountType: AccountType;
    public userIdentifier;
    public maskAccountNumber: string;
    public maskCurrentBalance: boolean = false;
  }
export class Transaction  {
  public transactionId: number;
    public accountId: number;
    public senderAccountId : number;
    public receiverAccountId : number;
    public paymentMethodId : number;
    public amount : number;
    public transactionDate: Date;
    public senderAccountNumber : number;
    public receiverAccountNumber : number;
    public paymentMethodType : string; 
    public currentBalance: number;   
    public receiverName: string;
    public bsbNumber: string;
    public cellPhone: number;
  }

  export class TransactionExport  {
    public senderAccountNumber : number;
    public receiverAccountNumber : number;
    public paymentMethodType : string;
    public debitcredit: string = '';
    public amountString : string;
    public dateString : string;
    public currentBalance: number;  
    public receiverName: string; 
  }
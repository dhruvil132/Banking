export enum AccountType {
    Savings,
    Current
  }
  
  export const AccountTypeOption = new Map<AccountType, string>([
    [AccountType.Savings, 'Savings'],
    [AccountType.Current, 'Current']
  ]);
  
  
  
using core.Domain.InterfaceRepository;
using core.Domain.Models;
using Core.Data.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Data.Repositories
{
	public class AccountRepository : IAccountRepository
	{
		#region Private Variables
		private CoreContext _coreContext;
		#endregion

		#region Context
		public AccountRepository(CoreContext coreContext)
		{
			_coreContext = coreContext;
		}
		#endregion


		/// <summary>
		/// get accounts by identifier
		/// </summary>
		/// <param name="identifier"></param>
		/// <returns></returns>
		public async Task<List<Account>> GetAccountsByIdentifier(Guid identifier)
		{
			return await _coreContext.Accounts.Where(x => x.UserIdentifier == identifier).ToListAsync();
		}
		/// <summary>
		/// create new account 
		/// </summary>
		/// <param name="account"></param>
		/// <returns></returns>
		public async Task<Account> CreateAccount(Account account)
		{
			var result = _coreContext.Accounts.Add(account);
			await _coreContext.SaveChangesAsync();
			return account;
		}

		/// <summary>
		/// Update account 
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>

		public async Task<Account> UpdateAccount(Account model)
		{

			var update = await _coreContext.Accounts.FirstOrDefaultAsync(jt => jt.AccountId == model.AccountId);
			if (update == null)
				return null;

			update.AccountNumber = model.AccountNumber;
			update.AccountHolderName = model.AccountHolderName;
			update.BSBNumber = model.BSBNumber;
			update.CurrentBalance = model.CurrentBalance;
			update.AccountType = model.AccountType;
			update.UpdatedAt = DateTime.UtcNow;
			await _coreContext.SaveChangesAsync();
			return update;

		}

		/// <summary>
		/// create new account 
		/// </summary>
		/// <param name="transaction"></param>
		/// <returns></returns>
		public async Task<Transaction> CreateTransaction(Transaction transaction)
		{
			var result = _coreContext.Transactions.Add(transaction);
			await _coreContext.SaveChangesAsync();
			return transaction;
		}
		/// <summary>
		/// Get Transaction By AccountId
		/// </summary>
		/// <param name="accountId"></param>
		/// <returns></returns>
		public async Task<List<Transaction>> GetTransactionByAccountId(int accountId)
		{
			var transactionList = from z in _coreContext.Transactions
								 join s in _coreContext.Accounts on z.SenderAccountId equals s.AccountId 
								  join r in _coreContext.Accounts on z.ReceiverAccountId equals r.AccountId
								join p in _coreContext.PaymentMethod on z.PaymentMethodId equals p.PaymentMethodId
							 where z.AccountId == accountId
							 select new Transaction { 
								 TransactionId = z.TransactionId, 
								 SenderAccountId = z.SenderAccountId, 
								 ReceiverAccountId = z.ReceiverAccountId,
								 PaymentMethodId = z.PaymentMethodId,
								 TransactionDate = z.TransactionDate,
								 Amount = z.Amount,
								 AccountId = z.AccountId,
								 SenderAccountNumber = s.AccountNumber,
								 ReceiverAccountNumber = r.AccountNumber,
								 PaymentMethodType = p.PaymentMethodType,
								 CurrentBalance = z.CurrentBalance,
								 ReceiverName = r.AccountHolderName
							 };
			return transactionList.OrderByDescending(x=> x.TransactionDate).ToList();


		}

		/// <summary>
		/// Get Transaction By AccountId
		/// </summary>
		/// <param name="accountId"></param>
		/// <returns></returns>
		public async Task<List<Transaction>> GetRecentTransactionByAccountId(int accountId)
		{
			var transactionList = from z in _coreContext.Transactions
								  join s in _coreContext.Accounts on z.SenderAccountId equals s.AccountId
								  join r in _coreContext.Accounts on z.ReceiverAccountId equals r.AccountId
								  join p in _coreContext.PaymentMethod on z.PaymentMethodId equals p.PaymentMethodId
								  where z.AccountId == accountId
								  select new Transaction
								  {
									  TransactionId = z.TransactionId,
									  SenderAccountId = z.SenderAccountId,
									  ReceiverAccountId = z.ReceiverAccountId,
									  PaymentMethodId = z.PaymentMethodId,
									  TransactionDate = z.TransactionDate,
									  Amount = z.Amount,
									  AccountId = z.AccountId,
									  SenderAccountNumber = s.AccountNumber,
									  ReceiverAccountNumber = r.AccountNumber,
									  PaymentMethodType = p.PaymentMethodType,
									  CurrentBalance = z.CurrentBalance,
									  ReceiverName = r.AccountHolderName
								  };
			return transactionList.OrderByDescending(x => x.TransactionDate).Take(10).ToList();


		}

		/// <summary>
		/// Get Account By AccountNumber
		/// </summary>
		/// <param name="accountNumber"></param>
		/// <returns></returns>
		public async Task<Account> GetAccountByAccountNumber(int accountNumber)
		{
			return await _coreContext.Accounts.Where(x => x.AccountNumber == accountNumber).FirstOrDefaultAsync();
		}

		/// <summary>
		/// Get Account By AccountId
		/// </summary>
		/// <param name="accountId"></param>
		/// <returns></returns>
		public async Task<Account> GetAccountByAccountId(int accountId)
		{
			return await _coreContext.Accounts.Where(x => x.AccountId == accountId).FirstOrDefaultAsync();
		}
		/// <summary>
		/// Get All Send Transactions By AccountId
		/// </summary>
		/// <param name="accountId"></param>
		/// <returns></returns>
		public async Task<List<Transaction>> GetAllSendTransactionsByAccountId(int accountId)
		{
			var transactionList = from z in _coreContext.Transactions
								  join s in _coreContext.Accounts on z.SenderAccountId equals s.AccountId
								  join r in _coreContext.Accounts on z.ReceiverAccountId equals r.AccountId
								  join p in _coreContext.PaymentMethod on z.PaymentMethodId equals p.PaymentMethodId
								  where z.AccountId == accountId && z.SenderAccountId == accountId && z.PaymentMethodId == 3
								  select new Transaction
								  {
									  TransactionId = z.TransactionId,
									  SenderAccountId = z.SenderAccountId,
									  ReceiverAccountId = z.ReceiverAccountId,
									  PaymentMethodId = z.PaymentMethodId,
									  TransactionDate = z.TransactionDate,
									  Amount = z.Amount,
									  AccountId = z.AccountId,
									  SenderAccountNumber = s.AccountNumber,
									  ReceiverAccountNumber = r.AccountNumber,
									  PaymentMethodType = p.PaymentMethodType,
									  CurrentBalance = z.CurrentBalance,
									  ReceiverName = r.AccountHolderName,
									  BSBNumber = r.BSBNumber
								  };
			return transactionList.OrderByDescending(x => x.TransactionDate).ToList();


		}
	}
}

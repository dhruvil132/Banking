using core.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.InterfaceRepository
{
	public interface IAccountRepository
	{
		Task<List<Account>> GetAccountsByIdentifier(Guid identifier);
		Task<Account> CreateAccount(Account account);
		Task<Account> UpdateAccount(Account model);
		Task<Transaction> CreateTransaction(Transaction transaction);
		Task<List<Transaction>> GetTransactionByAccountId(int accountId);
		Task<List<Transaction>> GetRecentTransactionByAccountId(int accountId);
		Task<Account> GetAccountByAccountNumber(int accountNumber);

		Task<Account> GetAccountByAccountId(int accountId);
		Task<List<Transaction>> GetAllSendTransactionsByAccountId(int accountId);
	}
}

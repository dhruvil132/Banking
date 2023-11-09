using api.Infrastructure;
using Core.Data.Context;
using core.Domain.InterfaceRepository;
using core.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : Controller
	{
		#region Private Variables
		private readonly IUserRepository _userRepository;
		private readonly IAccountRepository _accountRepository;
		public readonly CoreContext _dbContext;
		#endregion

		#region Constructor
		public AccountController(CoreContext dbContext, IUserRepository userRepository,
			IAccountRepository accountRepository)
		{
			_dbContext = dbContext;
			_userRepository = userRepository;
			_accountRepository = accountRepository;
		}
		#endregion

		#region CRUD

		[HttpGet("getAccountsById/{userIdentifier}")]
		public async Task<IActionResult> GetAccountsById(Guid userIdentifier)
		{
			try
			{
				List<Account> accounts = await _accountRepository.GetAccountsByIdentifier(userIdentifier);
				return new JsonResult(accounts);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("addAccount")]
		public async Task<IActionResult> AddAccount([FromBody] Account account)
		{
			try
			{
				// Create a Random object
				Random random = new Random();
				// Generate a random number between 50,000 and 100,000
				account.CurrentBalance = random.Next(50000, 100001);
				Account exitingAccount = await _accountRepository.GetAccountByAccountNumber(account.AccountNumber);
				if (exitingAccount == null)
				{
					account = await _accountRepository.CreateAccount(account);
				}
				else
				{
					return UnprocessableEntity("Account with this account number already exists");
				}
				List<Transaction> transactions = new List<Transaction>();
				List<int> numbers = new List<int>();
				for (int i = 0; i < 10; i++)
				{
					numbers.Add(i);
				}

				// Shuffle the list using Fisher-Yates shuffle algorithm
				int n = numbers.Count;
				for (int i = n - 1; i > 0; i--)
				{
					int j = random.Next(0, i + 1);
					int temp = numbers[i];
					numbers[i] = numbers[j];
					numbers[j] = temp;
				}
				DateTime date = new DateTime(2022, 01, 01);
				foreach (int i in numbers)
				{
					int amount = 5000;
					decimal balance = account.CurrentBalance;
					int sender = 1; int receiver = 2;
					int paymentType = 1;
					if (i ==0)
					{
						amount = amount + 15;
						balance = balance + amount;
						receiver = account.AccountId;
						sender = 1;
						paymentType = 1;
					}

					if (i == 1)
					{
						amount = amount - 5;
						balance = balance - amount;
						sender = account.AccountId;
						receiver = 2;
						paymentType = 1;

					}

					if (i == 2)
					{
						amount = amount + 50;
						balance = balance + amount;
						receiver = account.AccountId;
						sender = 3;
						paymentType = 2;
					}

					if (i == 3)
					{
						amount = amount + 100;
						balance = balance + amount;
						receiver = account.AccountId;
						sender = 4;
						paymentType = 1;
					}

					if (i == 4)
					{
						amount = amount - 15;
						balance = balance - amount;
						sender = account.AccountId;
						receiver = 5;
						paymentType = 1;
					}
					if (i == 5)
					{
						amount = amount + 150;
						balance = balance + amount;
						receiver = account.AccountId;
						sender = 6;
						paymentType = 1;
					}
					if (i == 6)
					{
						amount = amount - 100;
						balance = balance - amount;
						sender = account.AccountId;
						receiver = 5;
						paymentType = 2;
					}
					if (i == 7)
					{
						amount = amount - 50;
						balance = balance - amount;
						sender = account.AccountId;
						receiver = 4;
						paymentType = 1;
					}
					if (i == 8)
					{
						amount = amount + 500;
						receiver = account.AccountId;
						balance = balance + amount;
						sender = 4;
						paymentType = 2;
					}
					if (i == 9)
					{
						amount = amount - 1000;
						balance = balance - amount;
						sender = account.AccountId;
						receiver = 3;
						paymentType = 1;
					}
					int randomDays = random.Next(1, 60);
					date = date.AddDays(randomDays);
					Transaction transaction = new Transaction();
					transaction.Amount = amount;
					transaction.CurrentBalance = balance;
					transaction.SenderAccountId = sender;
					transaction.AccountId = account.AccountId;
					transaction.ReceiverAccountId = receiver;
					transaction.PaymentMethodId = paymentType;
					transaction.TransactionDate = date;
					await _accountRepository.CreateTransaction(transaction);
					transactions.Add(transaction);
				}
				account.CurrentBalance = transactions.Last().CurrentBalance;
				account = await _accountRepository.UpdateAccount(account);
				return new JsonResult(account);

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpGet("getTransactionsByAccountId/{accountId}")]
		public async Task<IActionResult> GetTransactionsByAccountId(int accountId)
		{
			try
			{
				List<Transaction> transactions = await _accountRepository.GetTransactionByAccountId(accountId);
				return new JsonResult(transactions);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("getRecentTransactionsByAccountId/{accountId}")]
		public async Task<IActionResult> GetRecentTransactionsByAccountId(int accountId)
		{
			try
			{
				List<Transaction> transactions = await _accountRepository.GetRecentTransactionByAccountId(accountId);
				return new JsonResult(transactions);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpGet("getAccountByAccountId/{accountId}")]
		public async Task<IActionResult> GetAccountByAccountId(int accountId)
		{
			try
			{
				Account account = await _accountRepository.GetAccountByAccountId(accountId);
				return new JsonResult(account);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("updateAccount")]
		public async Task<IActionResult> UpdateAccount([FromBody] Account account)
		{
			try
			{
				Account exitingAccount = await _accountRepository.GetAccountByAccountNumber(account.AccountNumber);
				if (exitingAccount == null || (exitingAccount != null && exitingAccount.AccountId == account.AccountId))
				{
					account = await _accountRepository.UpdateAccount(account);
				}
				else
				{
					return UnprocessableEntity("Account with this account number already exists");
				}
				return new JsonResult(account);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpPost("trasferFunds")]
		public async Task<IActionResult> TrasferFunds([FromBody] Transaction transaction)
		{
			try
			{
				bool isReceiverAccountPresent = false;
				Account currentSelectedAccount = await _accountRepository.GetAccountByAccountId(transaction.AccountId);
				transaction.CurrentBalance = currentSelectedAccount.CurrentBalance - transaction.Amount;
				if (transaction.CurrentBalance < 0)
				{
					return UnprocessableEntity("Your current account balance is insufficient to complete the requested transaction.");
				}
				Account account = new Account();
				if (transaction.CellPhone != null)
				{
					User user = await _userRepository.GetUserByCellPhone(int.Parse(transaction.CellPhone));
					if(user == null)
					{
						Random random = new Random();
						account.AccountHolderName = transaction.ReceiverName;
						account.AccountNumber = random.Next(100000000, 999999999);
						account.BSBNumber = 222222.ToString();
						account.AccountType = core.Domain.Enums.AccountType.Savings;
						account.CurrentBalance = random.Next(50000, 100001);
						account = await _accountRepository.CreateAccount(account);
					}
					else
					{
						List<Account> receiverAccounts = await _accountRepository.GetAccountsByIdentifier(user.UserIdentifier.Value);
						if(receiverAccounts != null && receiverAccounts.Count > 1)
						{
							account = receiverAccounts.FirstOrDefault(x => x.AccountId != transaction.AccountId);
							account.CurrentBalance = account.CurrentBalance + transaction.Amount;
							isReceiverAccountPresent = true;
						}
						else
						{
							Random random = new Random();
							account.AccountHolderName = transaction.ReceiverName;
							account.AccountNumber = random.Next(100000000, 999999999);
							account.BSBNumber = 222222.ToString();
							account.AccountType = core.Domain.Enums.AccountType.Savings;
							account.CurrentBalance = random.Next(50000, 100001);
							account = await _accountRepository.CreateAccount(account);
						}
					}
				}
				else
				{
					account = await _accountRepository.GetAccountByAccountNumber(transaction.ReceiverAccountNumber);
					if (account == null)
					{
						account = new Account();
						account.BSBNumber = transaction.BSBNumber;
						account.AccountNumber = transaction.ReceiverAccountNumber;
						account.AccountHolderName = transaction.ReceiverName;
						account.AccountType = core.Domain.Enums.AccountType.Savings;
						Random random = new Random();
						account.CurrentBalance = random.Next(50000, 100001);
						account = await _accountRepository.CreateAccount(account);
					}
					else
					{
						account.CurrentBalance = account.CurrentBalance + transaction.Amount;
						isReceiverAccountPresent = true;
					}
				}
				transaction.ReceiverAccountId = account.AccountId;
				transaction.TransactionDate = DateTime.Now;
				transaction.PaymentMethodId = 3;
				await _accountRepository.CreateTransaction(transaction);
				currentSelectedAccount.CurrentBalance = transaction.CurrentBalance;
				await _accountRepository.UpdateAccount(currentSelectedAccount);
				if(isReceiverAccountPresent)
				{
					Transaction receiverTransaction = new Transaction();
					receiverTransaction.TransactionDate = DateTime.Now;
					receiverTransaction.PaymentMethodId = 3;
					receiverTransaction.Amount = transaction.Amount;
					receiverTransaction.AccountId = account.AccountId;
					receiverTransaction.ReceiverAccountId = account.AccountId;
					receiverTransaction.SenderAccountId = transaction.AccountId;
					receiverTransaction.CurrentBalance = account.CurrentBalance;
					await _accountRepository.CreateTransaction(receiverTransaction);
					await _accountRepository.UpdateAccount(account);
				}
				return new JsonResult(transaction);

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("getAllSendTransactionsByAccountId/{accountId}")]
		public async Task<IActionResult> GetAllSendTransactionsByAccountId(int accountId)
		{
			try
			{
				List<Transaction> transactions = await _accountRepository.GetAllSendTransactionsByAccountId(accountId);
				return new JsonResult(transactions);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("makePayment/{accountId}")]
		public async Task<IActionResult> MakePayment([FromBody] int amount, int accountId)
		{
			try
			{
				Account currentSelectedAccount = await _accountRepository.GetAccountByAccountId(accountId);
				Transaction transaction = new Transaction();
				transaction.CurrentBalance = currentSelectedAccount.CurrentBalance - amount;
				if (transaction.CurrentBalance < 0)
				{
					return UnprocessableEntity("Your current account balance is insufficient to complete the requested transaction.");
				}
				transaction.SenderAccountId = accountId;
				transaction.ReceiverAccountId = accountId;
				transaction.AccountId = accountId;
				transaction.TransactionDate = DateTime.Now;
				transaction.PaymentMethodId = 3;
				transaction.Amount = amount;
				await _accountRepository.CreateTransaction(transaction);
				currentSelectedAccount.CurrentBalance = transaction.CurrentBalance;
				await _accountRepository.UpdateAccount(currentSelectedAccount);
				return new JsonResult(transaction);

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		#endregion
	}
}

using api.Infrastructure;
using core.Data.Repositories;
using core.Domain.InterfaceRepository;
using core.Domain.Models;
using Core.Data.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : Controller
	{
		#region Private Variables
		private readonly IUserRepository _userRepository;
		private readonly IAccountRepository _accountRepository;
		private readonly IMailService _gmailService;
		public readonly CoreContext _dbContext;
		#endregion

		#region Constructor
		public UserController(CoreContext dbContext, IUserRepository userRepository,
			IMailService gmailService, IAccountRepository accountRepository)
		{
			_dbContext = dbContext;
			_userRepository = userRepository;
			_gmailService = gmailService;
			_accountRepository = accountRepository;
		}
		#endregion

		#region CRUD

		[HttpPost("addUser")]
		public async Task<IActionResult> AddUser([FromBody] User model)
		{
			try
			{
				User user = await _userRepository.GetUserByCellPhoneOrEmail(model.CellPhone, model.Email);
				if (user == null)
				{
					model.Password = setPasswordToBase64(model.Password);
					model.UserIdentifier = Guid.NewGuid();
					var retVal = await _userRepository.CreateUser(model);
					// Create a Random object
					Random random = new Random();
					Account account = new Account();
					account.AccountHolderName = model.Name + ' ' + model.Surname;
					account.AccountNumber = random.Next(100000000, 999999999);
					account.BSBNumber = 111111.ToString();
					account.UserIdentifier = model.UserIdentifier;
					account.AccountType = core.Domain.Enums.AccountType.Current;
					
					// Generate a random number between 50,000 and 100,000
					account.CurrentBalance = random.Next(50000, 100001);
					account = await _accountRepository.CreateAccount(account);
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
						if (i == 0)
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
							paymentType = 2;
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
					await _accountRepository.UpdateAccount(account);
					return new JsonResult(retVal);
				}
				else
				{
					return UnprocessableEntity("User with either this email or cellphone already exists.");
				}

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] User model)
		{
			try
			{
				model.Password = setPasswordToBase64(model.Password);
				var user = await _userRepository.CheckUser(model.Email, model.Password);

				if (user == null)
					return UnprocessableEntity("Your registered account information was not recognized. Please enter your email and password again");

				var tokenHandler = new JwtSecurityTokenHandler();
				var key = Encoding.ASCII.GetBytes("THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING");
				var expires = DateTime.Now.AddHours(1);
				var tokenDescriptor = new SecurityTokenDescriptor
				{
					Subject = new ClaimsIdentity(new Claim[]
					{
					new Claim(ClaimTypes.Name, model.Name)
					}),
					Expires = expires,
					SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
				};
				var token = tokenHandler.CreateToken(tokenDescriptor);
				string securityToken = tokenHandler.WriteToken(token);

				return Ok(new
				{
					token = securityToken,
					expiresIn = expires,
					userIdentifier = user.UserIdentifier
				});
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("getUserById/{userIdentifier}")]
		public async Task<IActionResult> GetUserById(Guid userIdentifier)
		{
			try
			{
				var user = await _userRepository.GetUserByIdentifier(userIdentifier);
				if (user != null)
				{
					user.Password = getPasswordFromBase64(user.Password);
				}
				return new JsonResult(user);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("checkUserExists/{email}")]
		public async Task<IActionResult> CheckUserExists(string email)
		{
			try
			{
				User user = await _userRepository.GetUserByEmail(email);
				if (user == null)
				{
					return new JsonResult(false);
				}
				return new JsonResult(true);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("updateUserEmail/{userIdentifier}")]
		public async Task<IActionResult> UpdateUserEmail([FromBody] User model, Guid userIdentifier)
		{
			try
			{
				User user = await _userRepository.GetUserByEmail(model.Email);
				if (user == null)
				{
					user = await _userRepository.UpdateUserAccountDetails(userIdentifier, model);
					user.Password = getPasswordFromBase64(user.Password);
					return new JsonResult(user);
				}
				else
				{
					return UnprocessableEntity("New email should be different than the existing email. Please check your entry and try again.");
				}

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpPost("updateUser/{userIdentifier}")]
		public async Task<IActionResult> UpdateUser([FromBody] User model, Guid userIdentifier)
		{
			try
			{

				User user = await _userRepository.UpdateUserAccountDetails(userIdentifier, model);
				user.Password = getPasswordFromBase64(user.Password);
				return new JsonResult(user);

			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpPost("changePassword/{userIdentifier}")]
		public async Task<IActionResult> ChangePassword([FromBody] User model,Guid userIdentifier)
		{
			try
			{
				model.Password = setPasswordToBase64(model.Password);
				User user = await _userRepository.UpdatePassword(userIdentifier, model.Password);
				user.Password = getPasswordFromBase64(user.Password);
				return new JsonResult(user);


			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("sendForgotPasswordMail/{email}")]
		public async Task<IActionResult> ForgotPassword(string email)
		{
			try
			{
				User user = await _userRepository.GetUserByEmail(email);
				if (user == null)
				{
					return UnprocessableEntity("User with this email doesnot exists.");
				}
				else
				{
					string link = "http://localhost:5000/change-password/" + user.UserIdentifier;
					string htmlContent = @"
							<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Ebank Password</title>
</head>
<body>
    <p>Hello, " + user.Name + @"</p>
    <p>You recently requested to reset your password for Ebank. Please click the button below to reset your password.</p>
    <a href= "+link + @"  style=""display: inline-block; background-color: #007BFF; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;"">Click Me</a>
<br/>
<hr>
<p>If you did not request your password to be reset, please disregard this email.</p>
<br/>
<p>Thank you,</p>
<p>Ebank</p>
</body>
</html>";
					bool isSent = await _gmailService.SendOTPForForgotPassword(email, htmlContent);
					return new JsonResult(isSent);
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpPost("verifyUser")]
		public async Task<IActionResult> VerifyUser([FromBody] User user)
		{
			try
			{
				user.Password = setPasswordToBase64(user.Password);
				User existingUser = await _userRepository.GetUserByIdentifier(user.UserIdentifier.Value);
				if(existingUser.Password == user.Password)
				{
					return new JsonResult(true);
				}
				return new JsonResult(false);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}

		[HttpPost("addSettings")]
		public async Task<IActionResult> AddSettings([FromBody] Settings model)
		{
			try
			{
				Settings settings = await _userRepository.GetSettingsByIdentifier(model.UserIdentifier);
				if(settings != null && settings.SettingsId != null)
				{
					settings = await _userRepository.UpdateSettings(model);
				}
				else
				{
					settings = await _userRepository.CreateSettings(model);
				}
				return new JsonResult(settings);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		[HttpGet("getSettings/{userIdentifier}")]
		public async Task<IActionResult> GetSettings(Guid userIdentifier)
		{
			try
			{
				Settings retVal = await _userRepository.GetSettingsByIdentifier(userIdentifier);
				return new JsonResult(retVal);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return BadRequest(ex.Message);
			}

		}
		#endregion

		#region Private Methods
		private string getPasswordFromBase64(string password)
		{
			var base64Bytes = Convert.FromBase64String(password);
			// decrypted password
			return Encoding.UTF8.GetString(base64Bytes);
		}
		private string setPasswordToBase64(string password)
		{
			// Convert the password to a byte array
			byte[] bytesToEncode = Encoding.UTF8.GetBytes(password);
			// encryoted password
			return Convert.ToBase64String(bytesToEncode);
		}
		#endregion
	}
}

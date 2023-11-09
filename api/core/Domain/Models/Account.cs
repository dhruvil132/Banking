using core.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.Models
{
	public class Account
	{
		#region Constructor
		public Account()
		{
			CreatedAt = DateTime.UtcNow;
			UpdatedAt = DateTime.UtcNow;
		}
		#endregion

		[Key]
		public int AccountId { get; set; }
		public Guid? UserIdentifier { get; set; }

		public string BSBNumber { get; set; }
		public string AccountHolderName { get; set; }
		public int AccountNumber { get; set; }
		public decimal CurrentBalance { get; set; }
		public AccountType AccountType { get; set; } = AccountType.Savings;
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
	}
}

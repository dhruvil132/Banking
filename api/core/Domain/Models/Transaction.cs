using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.Models
{
	public class Transaction
	{
		#region Constructor
		public Transaction()
		{
			CreatedAt = DateTime.UtcNow;
			UpdatedAt = DateTime.UtcNow;
		}
		#endregion

		[Key]
		public int TransactionId { get; set; }
		public int? SenderAccountId { get; set; }
		public int? ReceiverAccountId { get; set; }
		public int AccountId { get; set; }
		public int PaymentMethodId { get; set; }
		public decimal CurrentBalance { get; set; }


		public decimal Amount { get; set; }

		public DateTime TransactionDate { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }

		[NotMapped]
		public int ReceiverAccountNumber { get; set; } 

		[NotMapped]
		public int SenderAccountNumber { get; set; }

		[NotMapped]
		public string BSBNumber { get; set; }

		[NotMapped]
		public string ReceiverName { get; set; }
		[NotMapped]
		public string? CellPhone { get; set; }

		[NotMapped]
		public string? PaymentMethodType { get; set; } = "";

	}
}

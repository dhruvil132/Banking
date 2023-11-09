using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.Models
{
	public class PaymentMethod
	{
		[Key]
		public int PaymentMethodId { get; set; }
		public string PaymentMethodType { get; set; }
	}
}

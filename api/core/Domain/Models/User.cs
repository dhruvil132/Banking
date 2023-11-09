using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.Models
{

	public class User
	{

		#region Constructor
		public User()
		{
			CreatedAt = DateTime.UtcNow;
			UpdatedAt = DateTime.UtcNow;
		}
		#endregion

		[Key]
		public int UserId { get; set; }
		public Guid? UserIdentifier { get; set; }

		[StringLength(100)]
		public string Name { get; set; }
		public string Surname { get; set; }
		public int CellPhone { get; set; }

		public string Email { get; set; }
		public string Password { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }

	}
}

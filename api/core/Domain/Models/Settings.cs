using core.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.Domain.Models
{
	public class Settings
	{
		#region Constructor
		public Settings()
		{
			CreatedAt = DateTime.UtcNow;
			UpdatedAt = DateTime.UtcNow;
		}
		#endregion

		[Key]
		public int SettingsId { get; set; }
		public Guid UserIdentifier { get; set; }

		public string FontSize { get; set; }
		public string Contrast { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
	}
}

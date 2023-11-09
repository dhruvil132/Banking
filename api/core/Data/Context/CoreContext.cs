#region Usings
using System;
using System.Data;
using core.Domain.Models;
using Microsoft.EntityFrameworkCore;
#endregion

namespace Core.Data.Context
{
	public class CoreContext : DbContext
	{
		#region Constructor

		public static string conStr { get; set; }
		public static string baseURL { get; set; }

		public CoreContext(DbContextOptions<CoreContext> options)
			: base(options) { }
		#endregion

		#region DbSets
		public DbSet<User> Users { get; set; }

		public DbSet<Account> Accounts { get; set; }

		public DbSet<Transaction> Transactions { get; set; }
		public DbSet<PaymentMethod> PaymentMethod { get; set; }
		public DbSet<Settings> Settings { get; set; }


		#endregion
	}
}

#region Usings
using core.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
#endregion

namespace core.Domain.InterfaceRepository
{
	public interface IUserRepository
	{
		#region Async

		Task<User> CreateUser(User user);
		Task<User> CheckUser(string email, string password);
		Task<User> GetUserByIdentifier(Guid identifier);
		Task<User> GetUserByEmail(string email);
		Task<User> UpdateUserAccountDetails(Guid identifier, User model);
		Task<User> UpdatePassword(Guid identifier, string password);
		Task<Settings> UpdateSettings(Settings model);
		Task<Settings> CreateSettings(Settings model);
		Task<Settings> GetSettingsByIdentifier(Guid identifier);
		Task<User> GetUserByCellPhone(int cellphone);
		Task<User> GetUserByCellPhoneOrEmail(int cellphone, string email);
		#endregion
	}
}
